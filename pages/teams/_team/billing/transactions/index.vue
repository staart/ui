<template>
  <div class="container container--type-settings">
    <aside>
      <BillingSidebar />
    </aside>
    <main class="card">
      <largeMessage
        v-if="noBilling"
        heading="No billing account"
        text="You need to setup a billing account before you view your transactions. You only need a billing account if you want to switch to a paid subscription, you can continue to use your free account."
        cta-text="Setup billing"
        :cta-to="`/teams/${$route.params.team}/billing/details`"
      />
      <div v-else>
        <div class="row">
          <h1>Transactions</h1>
          <div class="text text--align-right">
            <button
              aria-label="Refresh"
              data-balloon-pos="down"
              class="button button--type-icon"
              @click="load"
            >
              <font-awesome-icon
                title="Refresh"
                class="icon"
                icon="sync"
                :spin="!!loading"
                fixed-width
              />
            </button>
          </div>
        </div>
        <LargeMessage
          v-if="
            !loading &&
              (!transactions || !transactions.data || !transactions.data.length)
          "
          heading="No transactions yet"
          img="undraw_credit_card_payment_yb88.svg"
          text="This page will be updated when we have some transactions."
        />
        <div
          v-else-if="
            transactions && transactions.data && transactions.data.length
          "
        >
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(transaction, index) in transactions.data"
                :key="`${transaction.id}_${index}`"
              >
                <td><TimeAgo :date="transaction.created * 1000" /></td>
                <td>
                  {{ (transaction.currency || "eur").toUpperCase() }}
                  {{ transaction.amount | currency }}
                </td>
                <td>{{ transaction.description }}</td>
                <td>
                  {{ (transaction.currency || "eur").toUpperCase() }}
                  {{ transaction.ending_balance | currency }}
                </td>
                <td class="text text--align-right">
                  <router-link
                    :to="
                      `/teams/${$route.params.team}/billing/transactions/${transaction.id}`
                    "
                    aria-label="View"
                    data-balloon-pos="up"
                    class="button button--type-icon"
                  >
                    <font-awesome-icon class="icon" icon="eye" fixed-width />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination text text--align-center">
            <button
              v-if="transactions && transactions.hasMore"
              class="button"
              :disabled="loadingMore"
              @click="loadMore"
            >
              <span>Load more transactions</span>
              <font-awesome-icon
                v-if="!loadingMore"
                class="icon"
                icon="arrow-down"
              />
              <font-awesome-icon
                v-else
                class="icon icon--ml-2 icon--color-light"
                icon="sync"
                spin
              />
            </button>
          </div>
        </div>
        <Loading v-else-if="loading" :message="loading" />
        <h2>Add credits</h2>
        <p>If you have a coupon code to avail credits, enter that here.</p>
        <form @submit.prevent="availCredits">
          <Input
            :value="couponCode"
            label="Coupon code"
            placeholder="Copy and paste the coupon code"
            @input="val => (couponCode = val)"
          />
          <button class="button">Add credits</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faArrowDown,
  faSync,
  faCloudDownloadAlt,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import Confirm from "@/components/Confirm.vue";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import BillingSidebar from "@/components/sidebars/Billing.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Transactions, emptyPagination } from "@/types/manage";
import en from "@/locales/en";
library.add(faEye, faCloudDownloadAlt, faArrowDown, faSync, faTrash);
const months = en.months;

@Component({
  components: {
    BillingSidebar,
    Loading,
    TimeAgo,
    Input,
    Confirm,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  transactions: Transactions = emptyPagination;
  loadingMore = false;
  noBilling = false;
  loading = "";
  couponCode = "";

  private created() {
    this.transactions = {
      ...this.$store.getters["manage/transactions"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your transactions";
    this.$store
      .dispatch("manage/getTransactions", { team: this.$route.params.team })
      .then(transactions => {
        this.transactions = { ...transactions };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getTransactions", {
        team: this.$route.params.team,
        start: this.$store.state.manage.transactions[this.$route.params.team]
          .next
      })
      .then(() => {
        this.transactions = {
          ...this.$store.getters["manage/transactions"](this.$route.params.team)
        };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loadingMore = false));
  }

  private availCredits() {
    this.loading = "Adding your credits";
    this.$store
      .dispatch("manage/availCredits", {
        team: this.$route.params.team,
        couponCode: this.couponCode
      })
      .then(transactions => {
        this.transactions = { ...transactions };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => {
        this.loading = "";
        this.couponCode = "";
      });
  }
}
</script>

<style lang="scss" scoped></style>
