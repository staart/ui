<template>
  <main>
    <Manage>
      <h1>Subscription</h1>
      <Loading v-if="loading" :message="loading" />
      <LargeMessage
        v-else-if="
          !loading &&
            (!subscriptions ||
              !subscriptions.data ||
              !subscriptions.data.length)
        "
        heading="No subscriptions yet"
        text="You don't have any subscriptions yet, get started by creating one below."
      />
      <div v-else-if="subscriptions.data && subscriptions.data.length">
        <table class="table table--type-cols">
          <tbody>
            <tr
              v-for="(subscription, index) in subscriptions.data"
              :key="`${subscription.id}_${index}`"
            >
              <td>
                {{ subscription }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>New subscription</h2>
      <p>Create a new subscription for your organization.</p>
      <Loading v-if="loadingPricingPlans" :message="loadingPricingPlans" />
      <LargeMessage
        v-else-if="
          !loadingPricingPlans &&
            (!pricingPlans.data || !pricingPlans.data.length)
        "
        heading="No plans here"
        text="Unfortunately, we don't have any subscription plans available for you right now."
      />
      <form v-else>
        <div
          v-for="(plan, index) in pricingPlans.data"
          :key="`${plan.id}_${index}`"
        >
          <label>
            <input v-model="newPlan" type="radio" :value="plan.id" required />
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
        <p class="text text--size-small">
          On creating a new subscription, your default payment method will be
          billed.
        </p>
        <button class="button">Create subscription</button>
      </form>
    </Manage>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Manage from "@/components/Manage.vue";
import Loading from "@/components/Loading.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";

@Component({
  components: {
    Manage,
    Loading,
    Input,
    Select,
    LargeMessage,
    Checkbox
  },
  computed: mapGetters({
    organization: "auth/activeOrganization",
    user: "auth/user",
    subscriptions: "manage/subscriptions",
    pricingPlans: "manage/pricingPlans"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  subscriptions!: any;
  pricingPlans!: any;
  user!: any;
  loading = "";
  newPlan = "";
  loadingPricingPlans = "";

  private mounted() {
    this.loading = "Loading your subscriptions";
    this.$store
      .dispatch("manage/getSubscriptions", this.organization.organization.id)
      .then(subscriptions => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.$router.replace("/manage/billing");
        }
      })
      .finally(() => (this.loading = ""));

    this.loadingPricingPlans = "Loading pricing plans";
    this.$store
      .dispatch("manage/getPricingPlans", this.organization.organization.id)
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loadingPricingPlans = ""));
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
