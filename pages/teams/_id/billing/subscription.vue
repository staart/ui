<template>
  <div>
    <div>
      <h1 class="is-size-4 mb-4">Subscription</h1>
      <div v-for="subscription in subscriptions.data" :key="`s${subscription.id}`">
        <b-message v-if="!subscription.default_source" type="is-warning" has-icon>
          You don't have a payment method attached to this subscription. If
          we're unable to charge you, your subscription may be canceled.
          <nuxt-link :to="`/teams/${$route.params.id}/billing/sources`">Add payment method</nuxt-link>
        </b-message>
        <h2 class="is-size-5 mb-3">
          <span>{{ subscription.plan.nickname }}</span>
          <b-tag :type="getColor(subscription.status)">
            {{
            subscription.status === "trialing" ? "Trial" : subscription.status
            }}
          </b-tag>
          <b-tag type="is-danger" v-if="subscription.cancel_at_period_end">Scheduled for cancelation</b-tag>
        </h2>
        <table class="table">
          <tbody>
            <tr>
              <td>Started</td>
              <td>
                {{
                new Date(subscription.start_date * 1000).toLocaleDateString()
                }}
              </td>
            </tr>
            <tr>
              <td>Price</td>
              <td>
                <span>
                  {{
                  currencies[subscription.plan.currency] ||
                  subscription.plan.currency
                  }}{{ subscription.plan.amount / 100 }}
                </span>
                <span v-if="subscription.plan.interval_count !== 1">
                  every {{ subscription.plan.interval_count }}
                  {{ subscription.plan.interval }}s
                </span>
                <span v-else>/{{ subscription.plan.interval }}</span>
              </td>
            </tr>
            <tr v-if="subscription.status === 'trialing'">
              <td>Trial ends</td>
              <td>
                {{
                new Date(subscription.trial_end * 1000).toLocaleDateString()
                }}
              </td>
            </tr>
            <tr v-if="subscription.cancel_at">
              <td>Cancels</td>
              <td>
                {{
                new Date(subscription.cancel_at * 1000).toLocaleDateString()
                }}
              </td>
            </tr>
            <tr v-else>
              <td>Current period ends</td>
              <td>
                {{
                new Date(
                subscription.current_period_end * 1000
                ).toLocaleDateString()
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <form
          @submit.prevent="
            update(subscription.id, subscription.items.data[0].id)
          "
          v-if="availablePlans(subscription.plan.id).length"
        >
          <h2 class="is-size-5 mb-3">Change subscription</h2>
          <div
            v-for="plan in availablePlans(subscription.plan.id)"
            :key="`p${plan.id}`"
            class="field"
          >
            <b-radio v-model="selectedPlan" :native-value="plan.id">
              <span>{{ plan.nickname }}</span>
              (
              <span>
                <span>
                  {{ currencies[plan.currency] || plan.currency
                  }}{{ plan.amount / 100 }}
                </span>
                <span v-if="plan.interval_count !== 1">every {{ plan.interval_count }}</span>
                <span v-else>/{{ (plan.interval || "").charAt(0) }}</span>
              </span>)
            </b-radio>
          </div>
          <b-button native-type="submit" icon-left="pencil" :loading="loadingSave">Change plan</b-button>
        </form>
        <div
          v-if="
            subscription.status !== 'canceled' &&
              !subscription.cancel_at_period_end
          "
        >
          <h2 class="is-size-5 mb-3 mt-5">Danger zone</h2>
          <p>
            After you've canceled your subscription, you can continue to use it
            until the end of this billing cycle, but we won't charge you again.
          </p>
          <b-button
            type="is-danger"
            :loading="loadingDelete"
            @click="cancel(subscription.id)"
            icon-left="cancel"
          >Cancel subscription</b-button>
        </div>
        <div v-else>
          <h2 class="is-size-5 mb-3">Continue subscription</h2>
          <p>
            Your subscription has been canceled. If you've changed your mind,
            you can continue your subscription.
          </p>
          <b-button
            type="is-success"
            :loading="loadingDelete"
            icon-left="check"
            @click="keep(subscription.id)"
          >Keep subscription</b-button>
        </div>
      </div>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </div>
    <form @submit.prevent="save" v-if="plans.data.length && !subscriptions.data.length">
      <h2 class="is-size-5 mb-3">Change your plan</h2>
      <div v-for="plan in plans.data" :key="`p${plan.id}`" class="field">
        <b-radio v-model="selectedPlan" :native-value="plan.id">
          <span>{{ plan.nickname }}</span>
          (
          <span>
            <span>
              {{ currencies[plan.currency] || plan.currency
              }}{{ plan.amount / 100 }}
            </span>
            <span v-if="plan.interval_count !== 1">every {{ plan.interval_count }}</span>
            <span v-else>/{{ (plan.interval || "").charAt(0) }}</span>
          </span>)
          <span
            v-if="plan.trial_period_days"
            class="has-text-grey"
          >{{ plan.trial_period_days }} days free trial</span>
        </b-radio>
      </div>
      <b-button type="is-primary" native-type="submit" :loading="loadingSave">
        <span v-if="hasFreeTrial">Start free trial</span>
        <span v-else>Start subscription</span>
      </b-button>
      <b-loading :is-full-page="false" :active.sync="loadingPlans"></b-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class BillingDetails extends Vue {
  loading = false;
  loadingPlans = false;
  loadingSave = false;
  loadingDelete = false;

  subscriptions: any = { data: [] };
  plans: any = { data: [] };
  selectedPlan = "";
  currencies = {
    usd: "$",
    eur: "€",
    inr: "₹",
  };

  async mounted() {
    this.getPlans();
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/groups/${this.$route.params.id}/subscriptions`
      );
      this.subscriptions = data;
    } catch (error) {
      if (error.response?.data?.error === "no-customer")
        return this.$router.replace(
          `/teams/${this.$route.params.id}/billing?no-billing-account`
        );
    }
    this.loading = false;
  }

  async getPlans() {
    this.loadingPlans = true;
    try {
      const { data } = await this.$axios.get(
        `/groups/${this.$route.params.id}/billing/pricing`
      );
      this.plans = data;
      if (this.plans.data.length) this.selectedPlan = this.plans.data[0].id;
    } catch (error) {}
    this.loadingPlans = false;
  }

  async save() {
    this.loadingSave = true;
    try {
      const { data } = await this.$axios.put(
        `/groups/${this.$route.params.id}/subscriptions`,
        {
          plan: this.selectedPlan,
        }
      );
      this.get();
    } catch (error) {}
    this.loadingSave = false;
  }

  async update(id: string, currentId: string) {
    this.$buefy.dialog.confirm({
      title: "Changing your subscription",
      message: "Are you sure you want to change your subscription?",
      confirmText: "Yes, change subscription",
      cancelText: "No, don't change",
      type: "is-warning",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingSave = true;
        try {
          const { data } = await this.$axios.patch(
            `/groups/${this.$route.params.id}/subscriptions/${id}`,
            {
              cancel_at_period_end: false,
              proration_behavior: "create_prorations",
              items: [
                {
                  id: currentId,
                  plan: this.selectedPlan,
                },
              ],
            }
          );
          this.get();
        } catch (error) {}
        this.loadingSave = false;
      },
    });
  }

  async keep(id: string) {
    this.loadingDelete = true;
    try {
      const { data } = await this.$axios.patch(
        `/groups/${this.$route.params.id}/subscriptions/${id}`,
        {
          cancel_at_period_end: false,
        }
      );
      this.get();
    } catch (error) {}
    this.loadingDelete = false;
  }

  async cancel(id: string) {
    this.$buefy.dialog.confirm({
      title: "Canceling your subscription",
      message:
        "Are you sure you want to cancel your subscription? You'll still be able to use it until the end of this billing period.",
      confirmText: "Yes, cancel subscription",
      cancelText: "No, don't cancel",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingDelete = true;
        try {
          const { data } = await this.$axios.patch(
            `/groups/${this.$route.params.id}/subscriptions/${id}`,
            {
              cancel_at_period_end: true,
            }
          );
          this.get();
        } catch (error) {}
        this.loadingDelete = false;
      },
    });
  }

  get hasFreeTrial() {
    return !!this.plans.data.find((i: any) => i.id === this.selectedPlan)
      ?.trial_period_days;
  }

  availablePlans(id: string) {
    const plans: any = this.plans.data.filter((i: any) => i.id !== id);
    if (plans.length) this.selectedPlan = plans[0].id;
    return plans;
  }

  getColor(status: string) {
    switch (status) {
      case "active":
        return "is-success";
      case "trialing":
        return "is-warning";
      case "past_due":
      case "canceled":
      case "unpaid":
        return "is-danger";
      default:
        return "is-light";
    }
  }
}
</script>
