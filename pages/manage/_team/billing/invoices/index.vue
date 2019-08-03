<template>
  <main>
    <largeMessage
      v-if="noBilling"
      heading="No billing account"
      text="You need to setup a billing account before you view your invoices. You only need a billing account if you want to switch to a paid subscription, you can continue to use your free account."
      cta-text="Setup billing"
      :cta-to="`/manage/${$route.params.team}/billing/details`"
    />
    <Loading v-else-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Invoices</h1>
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
              fixed-width
            />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="
          !loading && (!invoices || !invoices.data || !invoices.data.length)
        "
        img="undraw_printing_invoices_5r4r.svg"
        heading="No invoices yet"
        text="You don't have any invoices yet, you'll see them here as soon as you have some."
      />
      <div v-else-if="invoices && invoices.data && invoices.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(invoice, index) in invoices.data"
              :key="`${invoice.id}_${index}`"
            >
              <td>
                <code>{{ invoice.number }}</code>
              </td>
              <td>
                {{ invoice.currency && invoice.currency.toUpperCase() }}
                {{ invoice.total | currency }}
              </td>
              <td>
                <span :class="`label label--color-${invoice.status}`">
                  {{ invoice.status }}
                </span>
              </td>
              <td>
                <TimeAgo :date="invoice.created * 1000" />
              </td>
              <td class="text text--align-right">
                <a
                  v-if="!invoice.paid"
                  :href="invoice.hosted_invoice_url"
                  target="_blank"
                  class="button button--type-icon button--color-primary"
                >
                  <font-awesome-icon
                    class="icon icon--mr-1"
                    icon="credit-card"
                    fixed-width
                  />
                  <span>Pay</span>
                </a>
                <a
                  :href="invoice.invoice_pdf"
                  aria-label="Download PDF"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    title="Download PDF"
                    class="icon"
                    icon="cloud-download-alt"
                    fixed-width
                  />
                </a>
                <router-link
                  :to="
                    `/manage/${$route.params.team}/billing/invoices/${invoice.id}`
                  "
                  aria-label="Details"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    title="Details"
                    class="icon"
                    icon="file-invoice-dollar"
                    fixed-width
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="invoices && invoices.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more invoices</span>
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
    </div>
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
  faArrowDown,
  faSync,
  faCreditCard,
  faCloudDownloadAlt
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Invoices, emptyPagination } from "@/types/manage";
library.add(
  faFileInvoiceDollar,
  faCreditCard,
  faCloudDownloadAlt,
  faArrowDown,
  faSync
);

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
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  invoices: Invoices = emptyPagination;
  loadingMore = false;
  noBilling = false;
  loading = "";

  private created() {
    this.invoices = {
      ...this.$store.getters["manage/invoices"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your invoices";
    this.$store
      .dispatch("manage/getInvoices", { team: this.$route.params.team })
      .then(invoices => {
        this.invoices = { ...invoices };
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
      .dispatch("manage/getInvoices", {
        team: this.$route.params.team,
        start: this.$store.state.manage.invoices[this.$route.params.team].next
      })
      .then(() => {
        this.invoices = {
          ...this.$store.getters["manage/invoices"](this.$route.params.team)
        };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loadingMore = false));
  }
}
</script>
