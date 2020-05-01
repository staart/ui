<template>
  <div>
    <h1 class="is-size-4">Customer details</h1>
    <form @submit.prevent="save" style="margin-top: 1rem">
      <b-field label="Name">
        <b-input type="text" v-model="customer.name" required />
      </b-field>
      <div class="columns">
        <b-field
          label="Email"
          class="column"
          style="margin-bottom: 0; padding-bottom: 0"
        >
          <b-input type="email" v-model="customer.email" required />
        </b-field>
        <b-field
          label="Phone"
          class="column"
          style="margin-bottom: 0; padding-bottom: 0"
        >
          <b-input type="text" v-model="customer.phone" />
        </b-field>
      </div>
      <b-field label="Address">
        <b-input type="text" v-model="customer.address.line1" />
      </b-field>
      <div class="columns">
        <b-field
          label="Postal code"
          class="column"
          style="margin-bottom: 0; padding-bottom: 0"
        >
          <b-input type="text" v-model="customer.address.postal_code" />
        </b-field>
        <b-field
          label="City"
          class="column"
          style="margin-bottom: 0; padding-bottom: 0"
        >
          <b-input type="text" v-model="customer.address.city" />
        </b-field>
      </div>
      <div class="columns">
        <b-field
          label="State"
          class="column"
          style="margin-bottom: 0; padding-bottom: 0"
        >
          <b-input type="text" v-model="customer.address.state" />
        </b-field>
        <b-field
          label="Country"
          class="column"
          style="margin-bottom: 0; padding-bottom: 0"
        >
          <b-input type="text" v-model="customer.address.country" />
        </b-field>
      </div>
      <b-button type="is-primary" native-type="submit" :loading="loadingSave">
        Update details
      </b-button>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
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
  customer = {
    email: "",
    name: "",
    phone: "",
    address: {
      city: "",
      country: "",
      line1: "",
      line2: "",
      postal_code: "",
      state: "",
    },
  };
  loading = false;
  loadingSave = false;

  async mounted() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/billing`
      );
      if (!data.address)
        data.address = {
          city: "",
          country: "",
          line1: "",
          line2: "",
          postal_code: "",
          state: "",
        };
      this.customer = data;
    } catch (error) {}
    this.loading = false;
  }

  async save() {
    this.loadingSave = true;
    try {
      const { data } = await this.$axios.patch(
        `/organizations/${this.$route.params.username}/billing`,
        {
          name: this.customer.name,
          email: this.customer.email,
          phone: this.customer.phone,
          address: this.customer.address,
        }
      );
    } catch (error) {}
    this.loadingSave = false;
  }
}
</script>
