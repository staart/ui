<template>
  <main>
    <largeMessage
      v-if="noBilling"
      heading="No billing account"
      text="You need to setup a billing account before you can create a subscription."
      cta-text="Setup billing"
      cta-to="/manage/billing"
    />
    <Loading v-else-if="loading" :message="loading" />
    <div v-else>
      <h1>Subscriptions</h1>
      <LargeMessage
        v-if="
          !loading &&
            (!subscriptions ||
              !subscriptions.data ||
              !subscriptions.data.length)
        "
        heading="No subscriptions yet"
        text="You don't have any subscriptions yet, get started by creating one below."
      />
      <div
        v-else-if="
          subscriptions && subscriptions.data && subscriptions.data.length
        "
      >
        <table class="table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Billing period</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(subscription, index) in subscriptions.data"
              :key="`${subscription.id}_${index}`"
            >
              <td>
                <span>{{ subscription.plan.nickname }}</span>
                <span :class="`label label--color-${subscription.status}`">{{
                  subscription.status
                }}</span>
              </td>
              <td>
                <span>{{ subscription.plan.currency.toUpperCase() }}</span>
                <span>{{ subscription.plan.amount }}</span>
                <span>{{
                  subscription.plan.interval_count == 1
                    ? "per"
                    : `per ${subscription.plan.interval_count}`
                }}</span>
                <span v-if="subscription.plan.interval_count != 1">{{
                  subscription.plan.interval_count
                }}</span>
                <span>{{ subscription.plan.interval }}</span>
              </td>
              <td>
                Ends <TimeAgo :date="subscription.current_period_end * 1000" />
              </td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/manage/${$route.params.team}/invoices/${subscription.latest_invoice}`
                  "
                  data-balloon="Last invoice"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    title="Last invoice"
                    class="icon"
                    icon="file-invoice-dollar"
                    fixed-width
                  />
                </router-link>
                <router-link
                  :to="
                    `/manage/${$route.params.team}/subscriptions/${subscription.id}`
                  "
                  data-balloon="Edit"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    title="Edit"
                    class="icon"
                    icon="pencil-alt"
                    fixed-width
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="subscriptions && subscriptions.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more subscriptions</span>
            <font-awesome-icon
              v-if="!loadingMore"
              class="icon"
              icon="arrow-down"
            />
            <font-awesome-icon
              v-else
              title="Available"
              class="icon icon--ml-2 icon--color-light"
              icon="sync"
              spin
            />
          </button>
        </div>
      </div>
      <h2>New subscription</h2>
      <p>
        Create a new subscription for your organization. Your default payment
        method will be charged automatically
      </p>
      <Loading v-if="loadingPricingPlans" :message="loadingPricingPlans" />
      <LargeMessage
        v-else-if="
          !loadingPricingPlans &&
            (!pricingPlans || !pricingPlans.data || !pricingPlans.data.length)
        "
        heading="No plans here"
        text="Unfortunately, we don't have any subscription plans available for you right now."
      />
      <form v-else @submit.prevent="createSubscription">
        <div
          v-for="(plan, index) in pricingPlans.data"
          :key="`${plan.id}_${index}`"
          class="fake-radio-container"
        >
          <label>
            <input v-model="newPlan" type="radio" :value="plan.id" required />
            <span class="fake-radio" role="radio" tabindex="0" />
            <strong class="name">{{ plan.nickname }}</strong>
            <span class="amount">
              {{ (plan.currency || "eur").toUpperCase() }}
              {{ parseFloat((plan.amount || 0) / 100).toLocaleString() }}
            </span>
            <span class="interval">
              {{
                plan.interval_count == 1 ? "per" : `per ${plan.interval_count}`
              }}
              {{ plan.interval }}
            </span>
          </label>
        </div>
        <button class="button">Create subscription</button>
      </form>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";

import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFileInvoiceDollar,
  faPencilAlt,
  faArrowDown,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import { Subscriptions, emptyPagination } from "../../../../types/manage";
library.add(faFileInvoiceDollar, faPencilAlt, faArrowDown, faSync);

@Component({
  components: {
    Loading,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  computed: mapGetters({
    user: "auth/user",
    pricingPlans: "manage/pricingPlans"
  }),
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  subscriptions: Subscriptions = emptyPagination;
  loadingMore = false;
  pricingPlans!: any;
  noBilling = false;
  user!: any;
  loading = "";
  newPlan = "";
  loadingPricingPlans = "";

  private created() {
    this.subscriptions = {
      ...this.$store.getters["manage/subscriptions"](this.$route.params.team)
    };
  }

  private mounted() {
    this.loading = "Loading your subscriptions";
    this.$store
      .dispatch("manage/getSubscriptions", { team: this.$route.params.team })
      .then(subscriptions => {
        this.subscriptions = { ...subscriptions };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loading = ""));

    this.loadingPricingPlans = "Loading pricing plans";
    this.$store
      .dispatch("manage/getPricingPlans", this.$route.params.team)
      .then(() => {
        this.newPlan = this.pricingPlans.data[0].id;
      })
      .catch(() => {})
      .finally(() => (this.loadingPricingPlans = ""));
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getSubscriptions", {
        team: this.$route.params.team,
        start: this.$store.state.manage.subscriptions[this.$route.params.team]
          .start
      })
      .then(subscriptions => {
        this.subscriptions = { ...subscriptions };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loadingMore = false));
  }

  private createSubscription() {
    this.loading = "Creating your subscription";
    this.$store
      .dispatch("manage/createSubscription", {
        team: this.$route.params.team,
        plan: this.newPlan
      })
      .then(subscriptions => {
        this.subscriptions = { ...subscriptions };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped>
.name {
  font-weight: bold;
}
.amount {
  margin-left: 0.25rem;
  display: inline-block;
  font-weight: 400;
}
.interval {
  font-size: 90%;
  opacity: 0.5;
}
input[type="radio"] {
  margin-bottom: 1rem;
}
</style>
