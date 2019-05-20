<template>
  <main>
    <largeMessage
      v-if="noBilling"
      heading="No billing account"
      text="You need to setup a billing account before you can view payment methods."
      cta-text="Setup billing"
      cta-to="/manage/billing"
    />
    <div v-else>
      <h1>Invoices</h1>
      <Loading v-if="loading" :message="loading" />
      <LargeMessage
        v-else-if="!loading && (!invoices || !invoices.length)"
        heading="No invoices yet"
        text="You don't have any invoices yet, come back here once you've made your first payment."
      />
      <div v-else>
        <table class="table table--type-cols">
          <tbody>
            <tr
              v-for="(invoice, index) in invoices.data"
              :key="`${invoice.id}_${index}`"
            >
              <td>
                {{ invoice }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";

@Component({
  components: {
    Loading,
    Input,
    Select,
    LargeMessage,
    Checkbox
  },
  computed: mapGetters({
    organization: "auth/activeOrganization",
    user: "auth/user",
    invoices: "manage/invoices"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  invoices!: any;
  user!: any;
  loading = "";
  noBilling = false;

  private mounted() {
    this.loading = "Loading your invoices";
    this.$store
      .dispatch("manage/getInvoices", this.organization.organization.id)
      .then(subscriptions => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.noBilling = true;
        }
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
