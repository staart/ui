<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Data and security</h1>
    <h2 class="is-size-5">Download your data</h2>
    <p style="margin: 1rem 0">
      You have the right to export all your data. You can download it in JSON
      format to transfer it to other tools. This does not include an export of
      your members' data.
    </p>
    <b-button type="is-primary" @click="get" :loading="loadingDownload">
      Download your data
    </b-button>
    <h2 style="margin-top: 2rem" class="is-size-5">Delete your data</h2>
    <p style="margin: 1rem 0">
      You can delete your account and all its data permanently. If any of your
      teams has multiple teams, it won't be deleted, and any paid subscriptions
      will remain.
    </p>
    <b-button type="is-danger" @click="deleteAccount" :loading="loadingDelete">
      Delete your account
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import download from "js-file-download";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class TeamsSecurity extends Vue {
  loadingDownload = false;
  loadingDelete = false;

  async get() {
    this.loadingDownload = true;
    try {
      const { data }: { data: any } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/data`
      );
      download(
        JSON.stringify(data, null, 2),
        `${data.username}-${new Date().toISOString()}.json`
      );
    } catch (error) {}
    this.loadingDownload = false;
  }

  async deleteAccount() {
    this.$buefy.dialog.confirm({
      title: "Deleting team",
      message:
        "Are you sure you want to delete this team? This action is not reversible, and all your subscriptions will be canceled.",
      confirmText: "Yes, delete",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingDelete = true;
        try {
          const { data } = await this.$axios.delete(
            `/organizations/${this.$route.params.username}`
          );
          this.$store.dispatch("auth/logout");
          this.$router.push("/");
        } catch (error) {}
      },
    });
  }
}
</script>
