<template>
  <div>
    <h1 class="is-size-4">Data and privacy</h1>
    <h2 class="is-size-5">Download your data</h2>
    <p>
      You have the right to export all your data. You can download it in JSON
      format.
    </p>
    <b-button type="is-primary" @click="get">Download your data</b-button>
    <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import download from "js-file-download";

@Component({
  middleware: "authenticated",
  layout: "users"
})
export default class UsersProfile extends Vue {
  loading = false;

  async get() {
    this.loading = true;
    const { data }: { data: any } = await this.$axios.get(
      `/users/${this.$route.params.username}/data`
    );
    this.loading = false;
  }
}
</script>
