<template>
  <div>
    <h1 class="is-size-4 mb-4">Credits &amp; history</h1>
    {{ transactions }}
    <h2 class="is-size-5 mb-3">Add credits</h2>
    <form @submit.prevent="add">
      <b-field label="Coupon code">
        <b-input type="text" v-model="couponCode" required />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd"
        >Avail credits</b-button
      >
    </form>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams"
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
        `/groups/${this.$route.params.id}/transactions`
      );
      this.transactions = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingAdd = true;
    try {
      const { data } = await this.$axios.put(
        `/groups/${this.$route.params.id}/transactions`,
        {
          couponCode: this.couponCode
        }
      );
    } catch (error) {}
    this.couponCode = "";
    this.loadingAdd = false;
  }
}
</script>
