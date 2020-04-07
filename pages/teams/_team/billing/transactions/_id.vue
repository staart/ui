<template>
  <div class="container container--type-settings">
    <aside>
      <BillingSidebar />
    </aside>
    <main class="card">
      <Loading v-if="loading" :message="loading" />
      <div v-else>
        <div class="row">
          <div>
            <nuxt-link
              :to="`/teams/${$route.params.team}/billing/transactions`"
              aria-label="Back"
              data-balloon-pos="down"
              class="button button--type-icon button--type-back"
            >
              <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
            </nuxt-link>
            <h1>Transaction</h1>
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
          v-if="!loading && !transaction"
          heading="Transaction not found"
          img="undraw_credit_card_payment_yb88.svg"
          text="We couldn't find this transaction for you."
        />
        <div v-else-if="transaction">
          <table class="table table--type-cols">
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <code>{{ transaction.id }}</code>
                </td>
              </tr>
              <tr>
                <td>Type</td>
                <td class="text text--transform-capitalize">
                  {{ transaction.type }}
                </td>
              </tr>
              <tr>
                <td>Amount</td>
                <td>
                  {{ (transaction.currency || "eur").toUpperCase() }}
                  {{ transaction.amount | currency }}
                </td>
              </tr>
              <tr>
                <td>Ending balance</td>
                <td>
                  {{ (transaction.currency || "eur").toUpperCase() }}
                  {{ transaction.ending_balance | currency }}
                </td>
              </tr>
              <tr v-if="transaction.description">
                <td>Description</td>
                <td>
                  {{ transaction.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
import { faArrowLeft, faSync } from "@fortawesome/free-solid-svg-icons";
import Confirm from "@/components/Confirm.vue";
import Loading from "@/components/Loading.vue";
import BillingSidebar from "@/components/sidebars/Billing.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Country from "@/components/Country.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Transactions, emptyPagination } from "@/types/manage";
import en from "@/locales/en";
import { customerBalanceTransactions } from "stripe";
library.add(faArrowLeft, faSync);

@Component({
  components: {
    Loading,
    TimeAgo,
    Input,
    BillingSidebar,
    Confirm,
    Country,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox,
  },
  middleware: "auth",
})
export default class ManageSettings extends Vue {
  transaction?: customerBalanceTransactions.ICustomerBalanceTransaction;
  loading = "";

  private created() {
    this.transaction = {
      ...this.$store.getters["manage/transaction"](
        this.$route.params.team,
        this.$route.params.id
      ),
    };
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading your transaction";
    this.$store
      .dispatch("manage/getTransaction", {
        team: this.$route.params.team,
        id: this.$route.params.id,
      })
      .then((transaction) => {
        this.transaction = { ...transaction };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>
