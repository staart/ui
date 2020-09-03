<template>
  <div>
    <h1 class="is-size-4 mb-4">Data and privacy</h1>
    <h2 class="is-size-5 mb-3">Download your data</h2>
    <p class="mb-3">
      You have the right to export all your data. You can download it in JSON
      format to transfer it to other tools. This does not include an export of
      your teams' data.
    </p>
    <b-button
      type="is-primary"
      @click="get"
      :loading="loadingDownload"
      icon-left="cloud-download"
    >
      Download your data
    </b-button>
    <h2 class="is-size-5 mb-3 mt-5">Delete your data</h2>
    <p class="mb-3">
      You can delete your account and all its data permanently. If any of your
      teams has multiple users, it won't be deleted, and any paid subscriptions
      will remain.
    </p>
    <b-button
      type="is-danger"
      @click="deleteAccount"
      :loading="loadingDelete"
      icon-left="delete"
    >
      Delete your account
    </b-button>
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
  loadingDownload = false;
  loadingDelete = false;

  async get() {
    this.loadingDownload = true;
    try {
      const { data }: { data: any } = await this.$axios.get(
        `/users/${this.$route.params.id}/security/data`
      );
      download(
        JSON.stringify(data, null, 2),
        `${data.id}-${new Date().toISOString()}.json`
      );
    } catch (error) {}
    this.loadingDownload = false;
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
        this.loadingDelete = true;
        try {
          const { data } = await this.$axios.delete(
            `/users/${this.$route.params.id}`
          );
          this.$store.dispatch("auth/logout");
          this.$router.push("/");
        } catch (error) {}
      }
    });
  }
}
</script>
