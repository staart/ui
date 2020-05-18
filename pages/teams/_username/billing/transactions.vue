<template>
  <div>
    <h1 class="is-size-4">Credits &amp; history</h1>
    {{ transactions }}
    <h2 class="is-size-5" style="margin-top: 1rem">Add credits</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0">
      <b-field label="Coupon code">
        <b-input type="text" v-model="couponCode" required />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd">
        Avail credits
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersProfile extends Vue {
  loading = false;
  loadingAdd = false;
  transactions: any = { data: [] };
  couponCode = "";

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/transactions`
      );
      this.transactions = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingAdd = true;
    try {
      const { data } = await this.$axios.put(
        `/organizations/${this.$route.params.username}/transactions`,
        {
          couponCode: this.couponCode,
        }
      );
    } catch (error) {}
    this.couponCode = "";
    this.loadingAdd = false;
  }
}
</script>
