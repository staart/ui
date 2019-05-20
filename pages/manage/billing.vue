<template>
  <main>
    <h1>Billing</h1>
    <p>
      Manage your billing account details. This information will be used for
      invoicing.
    </p>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div v-if="billing">
        <table class="table table--type-cols">
          <tbody>
            <tr>
              <td>Account balance</td>
              <td>
                <span style="text-transform: uppercase">{{
                  billing.currency || "eur"
                }}</span>
                {{ parseFloat(billing.account_balance).toFixed(2) }}
              </td>
            </tr>
            <tr>
              <td>Customer ID</td>
              <td>
                <code>{{ billing.id }}</code>
              </td>
            </tr>
            <tr>
              <td>Invoice prefix</td>
              <td>
                <code>{{ billing.invoice_prefix }}</code>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Billing details</h2>
      </div>
      <form @submit.prevent="save">
        <Input
          :value="name"
          label="Name"
          placeholder="Enter your full name"
          required
          @input="val => (name = val)"
        />
        <Input
          :value="email"
          type="email"
          label="Email"
          placeholder="Enter your billing email"
          required
          @input="val => (email = val)"
        />
        <Input
          :value="phone"
          label="Phone"
          placeholder="Enter your billing phone number"
          @input="val => (phone = val)"
        />
        <Input
          :value="addressLine1"
          label="Address"
          placeholder="Enter your address"
          @input="val => (addressLine1 = val)"
        />
        <Input
          :value="addressLine2"
          label="Line 2"
          placeholder="Add another address line"
          @input="val => (addressLine2 = val)"
        />
        <Input
          :value="addressCity"
          label="City"
          placeholder="Enter your city"
          @input="val => (addressCity = val)"
        />
        <Input
          :value="addressPostalCode"
          label="Postal code"
          placeholder="Enter your postal code"
          @input="val => (addressPostalCode = val)"
        />
        <Input
          :value="addressState"
          label="State"
          placeholder="Enter your state"
          @input="val => (addressState = val)"
        />
        <Select
          :value="addressCountry"
          label="Country"
          placeholder="Select your billing country"
          :options="countries"
          @input="val => (addressCountry = val)"
        />
        <button class="button">
          Update settings
        </button>
      </form>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";

@Component({
  components: {
    Loading,
    Input,
    Select,
    ImageInput,
    Checkbox
  },
  computed: mapGetters({
    organization: "auth/activeOrganization",
    user: "auth/user",
    billing: "manage/billing"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  billing!: any;
  user!: any;
  loading = "";
  countries = {};

  name = "";
  email = "";
  phone = "";
  addressLine1 = "";
  addressCity = "";
  addressCountry = "";
  addressLine2 = "";
  addressPostalCode = "";
  addressState = "";

  private created() {
    const countries = {};
    const allCountries = getAllCountries();
    for (const country in allCountries) {
      if (allCountries.hasOwnProperty(country)) {
        countries[country.toUpperCase()] = allCountries[country].name;
      }
    }
    this.countries = countries;
  }

  private mounted() {
    this.loading = "Loading billing details";
    this.$store
      .dispatch("manage/getBilling", this.organization.organization.id)
      .then(billing => {
        this.name = this.billing.name;
        this.email = this.billing.email;
        this.phone = this.billing.phone;
        if (this.billing.address) {
          this.addressLine1 = this.billing.address.line1;
          this.addressCity = this.billing.address.city;
          this.addressCountry = this.billing.address.country;
          this.addressLine2 = this.billing.address.line2;
          this.addressPostalCode = this.billing.address.postal_code;
          this.addressState = this.billing.address.state;
        }
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.name = this.user.name;
          this.addressCountry = (this.user.countryCode || "us").toUpperCase();
        }
      })
      .finally(() => (this.loading = ""));
  }

  private save() {
    this.loading = "Saving";
    const data: any = {
      id: this.organization.organization.id,
      name: this.name,
      email: this.email,
      phone: this.phone
    };
    if (this.addressLine1) {
      data.address = {
        line1: this.addressLine1,
        city: this.addressCity,
        country: this.addressCountry,
        line2: this.addressLine2,
        postal_code: this.addressPostalCode,
        state: this.addressState
      };
    }
    this.$store
      .dispatch("manage/updateBilling", data)
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
