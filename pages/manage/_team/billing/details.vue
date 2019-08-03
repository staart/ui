<template>
  <main>
    <div class="row">
      <h1>Customer details</h1>
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
    <p v-if="noBilling">
      Set up your billing account here. You only need a billing account if you
      want a paid subscription; you can continue to use a free subscription.
    </p>
    <p v-else>
      Manage your billing account details. This information will be used for
      invoicing.
    </p>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div v-if="billing">
        <table v-if="billing.id" class="table table--type-cols">
          <tbody>
            <tr>
              <td>Account balance</td>
              <td>
                <span style="text-transform: uppercase">{{
                  billing.currency || "eur"
                }}</span>
                {{ billing.account_balance | currency }}
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
      </div>
      <form
        v-meta-ctrl-enter="save"
        class="text text--mt-2"
        @submit.prevent="save"
      >
        <Input
          :value="billing.name"
          label="Name"
          placeholder="Enter your full name"
          required
          @input="val => (billing.name = val)"
        />
        <div class="row">
          <Input
            :value="billing.email"
            type="email"
            label="Email"
            placeholder="Enter your billing email"
            required
            @input="val => (billing.email = val)"
          />
          <Input
            :value="billing.phone"
            label="Phone"
            placeholder="Enter your billing phone number"
            @input="val => (billing.phone = val)"
          />
        </div>
        <Input
          :value="billing.address.line1"
          label="Address"
          placeholder="Enter your address"
          @input="val => (billing.address.line1 = val)"
        />
        <Input
          :value="billing.address.line2"
          label="Line 2"
          placeholder="Add another address line"
          @input="val => (billing.address.line2 = val)"
        />
        <div class="row">
          <Input
            :value="billing.address.postal_code"
            label="Postal code"
            placeholder="Enter your postal code"
            @input="val => (billing.address.postal_code = val)"
          />
          <Input
            :value="billing.address.city"
            label="City"
            placeholder="Enter your city"
            @input="val => (billing.address.city = val)"
          />
        </div>
        <div class="row">
          <Input
            :value="billing.address.state"
            label="State"
            placeholder="Enter your state"
            @input="val => (billing.address.state = val)"
          />
          <Select
            :value="billing.address.country"
            label="Country"
            placeholder="Select your billing country"
            :options="countries"
            @input="val => (billing.address.country = val)"
          />
        </div>
        <button v-if="noBilling" class="button button--state-cta">
          Create billing account
        </button>
        <button v-else class="button">
          Update settings
        </button>
      </form>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { User } from "@/types/auth";
import {
  Billing,
  emptyBilling,
  emptyAddress,
  Sources,
  emptyPagination
} from "@/types/manage";

library.add(faSync);

@Component({
  components: {
    Loading,
    Input,
    Select,
    ImageInput,
    Checkbox,
    FontAwesomeIcon
  },
  computed: mapGetters({
    user: "auth/user"
  }),
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  user!: User;
  billing: Billing = emptyBilling;
  loading = "";
  countries = {};
  noBilling = false;

  private created() {
    this.billing = {
      ...this.$store.getters["manage/billing"](this.$route.params.team),
      address: { ...emptyAddress, country: this.user.countryCode.toUpperCase() }
    };
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
    this.load();
  }

  private load() {
    this.loading = "Loading billing details";
    this.$store
      .dispatch("manage/getBilling", this.$route.params.team)
      .then(billing => {
        this.billing = {
          ...billing,
          address: billing.address
            ? { ...billing.address }
            : {
                ...emptyAddress,
                country: this.user.countryCode.toUpperCase()
              }
        };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.noBilling = true;
          this.billing = {
            email: this.user.email,
            name: this.user.name,
            address: {
              ...emptyAddress,
              country: this.user.countryCode.toUpperCase()
            }
          };
        }
      })
      .finally(() => (this.loading = ""));
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("manage/updateBilling", {
        team: this.$route.params.team,
        email: this.billing.email,
        name: this.billing.name,
        address:
          this.billing.address &&
          this.billing.address.line1 &&
          this.billing.address
      })
      .then(() => {
        this.billing = {
          ...this.$store.getters["manage/billing"](this.$route.params.team),
          address: {
            ...emptyAddress,
            country: this.user.countryCode.toUpperCase()
          }
        };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
