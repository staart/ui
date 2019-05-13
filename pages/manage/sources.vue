<template>
  <main>
    <Manage>
      <h1>Payment methods</h1>
      <Loading v-if="loading" :message="loading" />
      <div v-else-if="sources && sources.data && sources.data.length">
        <table class="table table--type-cols">
          <tbody>
            <tr
              v-for="(invoice, index) in sources.data"
              :key="`${invoice.id}_${index}`"
            >
              <td>
                {{ invoice }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <form>
        <h2>Add card</h2>
        <Input
          :value="newCardName"
          label="Name on card"
          placeholder="Enter your full name as on card"
          required
          @input="val => (newCardName = val)"
        />
        <Input
          :value="newCardNumber"
          label="Credit card number"
          placeholder="Enter your credit card number (16 digits)"
          required
          @input="val => (newCardNumber = val)"
        />
        <div class="row">
          <Select
            :value="newCardExpMonth"
            label="Expiry month"
            :options="{
              '01': 'January',
              '02': 'February',
              '03': 'March',
              '04': 'April',
              '05': 'May',
              '06': 'June',
              '07': 'July',
              '08': 'August',
              '09': 'September',
              '10': 'October',
              '11': 'November',
              '12': 'December'
            }"
            required
            @input="val => (newCardExpMonth = val)"
          />
          <Select
            :value="newCardExpYear"
            label="Expiry year"
            :options="years"
            required
            @input="val => (newCardExpYear = val)"
          />
          <Input
            :value="newCardCvv"
            label="CVV"
            placeholder="Enter your security code"
            required
            @input="val => (newCardCvv = val)"
          />
        </div>
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
    sources: "manage/sources"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  sources!: any;
  user!: any;
  loading = "";
  years: number[] = [];

  newCardNumber = "";
  newCardExpMonth = "01";
  newCardExpYear = new Date().getUTCFullYear() + 5;
  newCardCvv = "";
  newCardName = "";

  private created() {
    const years: number[] = [];
    for (let i = 0; i < 15; i++) {
      years.push(new Date().getUTCFullYear() + i);
    }
    this.years = years;
  }

  private mounted() {
    this.loading = "Loading your sources";
    this.$store
      .dispatch("manage/getSources", this.organization.organization.id)
      .then(subscriptions => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.$router.replace("/manage/billing");
        }
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
