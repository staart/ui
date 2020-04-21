<template>
  <div>
    <h1 class="is-size-4">Data and privacy</h1>
    <h2 class="is-size-5">Download your data</h2>
    <p>
      You have the right to export all your data. You can download it in JSON
      format.
    </p>
    <b-button type="is-primary" @click="get">Download your data</b-button>
    <h2 class="is-size-5">Delete your data</h2>
    <b-button type="is-danger" @click="deleteAccount"
      >Delete your account</b-button
    >
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
    download(
      JSON.stringify(data, null, 2),
      `${data.username}-${new Date().toISOString()}.json`
    );
    this.loading = false;
  }

  async deleteAccount() {
    this.$buefy.dialog.confirm({
      title: "Deleting your account",
      message:
        "Are you sure you want to delete your account? This action is not reversible.",
      confirmText: "Yes, delete",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        const { data } = await this.$axios.delete(
          `/users/${this.$route.params.username}`
        );
        this.$store.dispatch("auth/logout");
        this.$buefy.toast.open({
          message: data.text,
          type: "is-success"
        });
        this.$router.push("/");
      }
    });
  }
}
</script>
