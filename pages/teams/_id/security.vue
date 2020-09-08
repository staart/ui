<template>
  <div>
    <h1 class="is-size-4 mb-4">Data and security</h1>
    <form @submit.prevent="save">
      <b-field label="Team name">
        <b-input type="text" v-model="team.name" required />
      </b-field>
      <b-field label="IP address restrictions">
        <b-taginput v-model="ipRestrictions" icon="ip-network" placeholder="Add an IP CIDR"></b-taginput>
      </b-field>
      <b-field>
        <b-checkbox
          v-model="team.forceTwoFactor"
        >Force team members to enable two-factor authentication</b-checkbox>
      </b-field>
      <div>
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">Update team settings</b-button>
      </div>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </form>
    <h2 class="is-size-5 mb-3 mt-5">Download your data</h2>
    <p class="mb-3">
      You have the right to export all your data. You can download it in JSON
      format to transfer it to other tools. This does not include an export of
      your members' data.
    </p>
    <b-button
      type="is-primary"
      @click="download"
      :loading="loadingDownload"
      icon-left="cloud-download"
    >Download your data</b-button>
    <h2 class="is-size-5 mb-3 mt-5">Delete your data</h2>
    <p class="mb-3">
      You can delete your account and all its data permanently. If any of your
      teams has multiple teams, it won't be deleted, and any paid subscriptions
      will remain.
    </p>
    <b-button
      type="is-danger"
      @click="deleteAccount"
      :loading="loadingDelete"
      icon-left="delete"
    >Delete your account</b-button>
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
  loading = false;
  loadingSave = false;
  team: any = {};
  ipRestrictions: string[] = [];

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/groups/${this.$route.params.id}`
      );
      this.team = data;
      if (this.team.ipRestrictions)
        this.ipRestrictions = (this.team.ipRestrictions || [])
          .split(",")
          .map((i: string) => i.trim());
    } catch (error) {}
    this.loading = false;
  }

  async save() {
    this.loadingSave = true;
    try {
      const { data } = await this.$axios.patch(
        `/groups/${this.$route.params.id}`,
        {
          name: this.team.name,
          ipRestrictions: this.ipRestrictions.join(", ") || undefined,
          forceTwoFactor: this.team.forceTwoFactor,
        }
      );
      this.team = data.updated;
    } catch (error) {}
    this.loadingSave = false;
  }

  async download() {
    this.loadingDownload = true;
    try {
      const { data }: { data: any } = await this.$axios.get(
        `/groups/${this.$route.params.id}/data`
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
            `/groups/${this.$route.params.id}`
          );
          this.$store.dispatch("auth/logout");
          this.$router.push("/");
        } catch (error) {}
      },
    });
  }
}
</script>
