<template>
  <div>
    <h1 class="is-size-4">Invoices</h1>
    {{ invoices }}
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
  invoices: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/invoices`
      );
      this.invoices = data;
    } catch (error) {}
    this.loading = false;
  }
}
</script>
