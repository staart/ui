<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <div>
          <nuxt-link
            :to="`/manage/${$route.params.team}/billing/subscription`"
            aria-label="Back"
            data-balloon-pos="down"
            class="button button--type-icon button--type-back"
          >
            <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
          </nuxt-link>
          <h1>Subscription</h1>
        </div>
        <div class="text text--align-right">
          <button
            aria-label="Refresh"
            data-balloon-pos="down"
            class="button button--type-icon"
            @click="load"
          >
            <font-awesome-icon class="icon" icon="sync" fixed-width />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="!loading && !subscription"
        img="undraw_product_tour_foyt.svg"
        heading="Subscription not found"
        text="We couldn't find this subscription for you."
      />
      <div v-else-if="subscription">
        <table class="table table--type-cols">
          <tbody>
            <tr>
              <td>Subscription ID</td>
              <td>
                <code>{{ subscription.id }}</code>
              </td>
            </tr>
            <tr>
              <td>Created</td>
              <td><TimeAgo :date="subscription.created * 1000" /></td>
            </tr>
            <tr v-if="subscription.status">
              <td>Status</td>
              <td>
                <span :class="`label label--color-${subscription.status}`">{{
                  subscription.status
                }}</span>
                <span
                  v-if="subscription.cancel_at"
                  :class="`label label--color-danger`"
                  >Scheduled to cancel</span
                >
              </td>
            </tr>
            <tr v-if="subscription.cancel_at">
              <td>Cancels</td>
              <td><TimeAgo :date="subscription.cancel_at * 1000" /></td>
            </tr>
            <tr v-if="subscription.current_period_end">
              <td>Biling period end</td>
              <td>
                <TimeAgo :date="subscription.current_period_end * 1000" />
              </td>
            </tr>
            <tr v-if="subscription.plan && subscription.plan.nickname">
              <td>Plan</td>
              <td>
                {{ subscription.plan.nickname }}
              </td>
            </tr>
            <tr v-if="subscription.plan && subscription.plan.id">
              <td>Plan ID</td>
              <td>
                <code>{{ subscription.plan.id }}</code>
              </td>
            </tr>
            <tr v-if="subscription.plan && subscription.plan.currency">
              <td>Amount</td>
              <td>
                {{ (subscription.plan.currency || "eur").toUpperCase() }}
                {{ subscription.plan.amount | currency }}
              </td>
            </tr>
            <tr v-if="subscription.plan && subscription.plan.interval">
              <td>Billing interval</td>
              <td>
                {{ subscription.plan.interval_count }}
                {{ subscription.plan.interval }}
              </td>
            </tr>
            <tr v-if="subscription.trial_end">
              <td>Trial end</td>
              <td>
                <TimeAgo :date="subscription.trial_end * 1000" />
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!subscription.cancel_at" class="text text--mt-2">
          <button
            class="button button--color-danger"
            @click="() => (showDelete = true)"
          >
            Cancel subscription
          </button>
        </div>
        <div v-else class="card card--type-padded text text--mt-2">
          <h2>Scheduled for cancelation</h2>
          <p>
            This subscription will be cancelled at
            {{ new Date(subscription.cancel_at * 1000).toLocaleDateString() }}.
          </p>
          <button class="button button--color-success" @click="revertCancel">
            Revert cancelation
          </button>
        </div>
      </div>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>Are you sure you want to cancel this subscription?</h2>
        <p>
          Any data linked to this subscription will be permanently deleted and
          your any paid features will stop working immediately.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="cancelSubscription"
        >
          Yes, cancel
        </button>
        <button type="button" class="button" @click="showDelete = false">
          No, don't cancel
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFileInvoiceDollar,
  faPencilAlt,
  faArrowDown,
  faArrowLeft,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import { subscriptions } from "stripe";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Confirm from "@/components/Confirm.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Subscriptions, emptyPagination } from "@/types/manage";
library.add(faFileInvoiceDollar, faPencilAlt, faArrowLeft, faArrowDown, faSync);

@Component({
  components: {
    Confirm,
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
  subscription?: subscriptions.ISubscription;
  loadingMore = false;
  pricingPlans!: any;
  user!: any;
  loading = "";
  newPlan = "";
  loadingPricingPlans = "";
  showDelete = false;

  private created() {
    this.subscription = {
      ...this.$store.getters["manage/subscription"](
        this.$route.params.team,
        this.$route.params.id
      )
    };
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading your subscription";
    this.$store
      .dispatch("manage/getSubscription", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(subscription => {
        this.subscription = { ...subscription };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private cancelSubscription() {
    this.showDelete = false;
    this.loading = "Canceling your subscription";
    this.$store
      .dispatch("manage/editSubscription", {
        team: this.$route.params.team,
        id: this.$route.params.id,
        cancel_at_period_end: true
      })
      .then(subscription => {
        this.subscription = { ...subscription };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private revertCancel() {
    this.showDelete = false;
    this.loading = "Saving your subscription";
    this.$store
      .dispatch("manage/editSubscription", {
        team: this.$route.params.team,
        id: this.$route.params.id,
        cancel_at_period_end: false
      })
      .then(subscription => {
        this.subscription = { ...subscription };
      })
      .catch(() => {})
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
