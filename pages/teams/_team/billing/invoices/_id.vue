<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <h1>Invoice</h1>
      <LargeMessage
        v-if="!loading && !invoice"
        img="undraw_printing_invoices_5r4r.svg"
        heading="Invoice not found"
        text="We couldn't find this invoice for you."
      />
      <div v-else-if="invoice">
        <table class="table table--type-cols">
          <tbody>
            <tr>
              <td>Invoice #</td>
              <td>
                <code>{{ invoice.number }}</code>
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{{ new Date(invoice.created * 1000).toLocaleString() }}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <span :class="`label label--color-${invoice.status}`">
                  {{ invoice.status }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Created</td>
              <td><TimeAgo :date="invoice.created * 1000" /></td>
            </tr>
            <tr>
              <td>Amount due</td>
              <td>
                {{ invoice.currency && invoice.currency.toUpperCase() }}
                {{ invoice.amount_due | currency }}
              </td>
            </tr>
            <tr>
              <td>Amount paid</td>
              <td>
                {{ invoice.currency && invoice.currency.toUpperCase() }}
                {{ invoice.amount_paid | currency }}
              </td>
            </tr>
            <tr>
              <td>Amount remaining</td>
              <td>
                {{ invoice.currency && invoice.currency.toUpperCase() }}
                {{ invoice.amount_remaining | currency }}
              </td>
            </tr>
            <tr>
              <td>collection_method</td>
              <td>{{ invoice.collection_method }}</td>
            </tr>
            <tr>
              <td>billing_reason</td>
              <td>{{ invoice.billing_reason }}</td>
            </tr>
            <tr>
              <td>Customer</td>
              <td>{{ invoice.customer_name || invoice.customer_email }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text text--mt-2">
          <a target="_blank" :href="invoice.hosted_invoice_url" class="button">
            <font-awesome-icon
              class="icon icon--mr-1"
              icon="file-invoice-dollar"
              fixed-width
            />
            <span>View invoice</span>
          </a>
          <a
            target="_blank"
            :href="invoice.invoice_pdf"
            class="button icon icon--ml-2"
          >
            <font-awesome-icon
              class="icon icon--mr-1"
              icon="cloud-download-alt"
              fixed-width
            />
            <span>Download PDF</span>
          </a>
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
  faCloudDownloadAlt,
  faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import { invoices } from "stripe";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Invoices, emptyPagination } from "@/types/manage";
library.add(faCloudDownloadAlt, faFileInvoice);

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
  invoice?: invoices.IInvoice;
  loadingMore = false;
  loading = "";

  private created() {
    this.invoice = {
      ...this.$store.getters["manage/invoice"](
        this.$route.params.team,
        this.$route.params.id
      )
    };
  }

  private mounted() {
    this.loading = "Loading your invoice";
    this.$store
      .dispatch("manage/getInvoice", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(invoice => {
        this.invoice = { ...invoice };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>
