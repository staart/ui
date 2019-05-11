<template>
  <main>
    <Settings>
      <h2>Export data</h2>
      <p>
        You can download an export of your data in JSON format. This will help
        you keep track of what we have and transfer your settings to other apps.
      </p>
      <Loading v-if="isDownloading" message="Generating your export" />
      <form v-else @submit.prevent="exportData">
        <button class="button button--color-primary">
          Export my data
        </button>
      </form>
      <h2>Delete account</h2>
      <p>
        You can delete your Staart account. Note that this action is not
        reversable, and all your data will be permanently lost. If you ever
        change your mind, you'll have to create a new account.
      </p>
      <Loading v-if="isDeleting" message="Deleting your account" />
      <form v-else @submit.prevent="deleteAccount">
        <Input
          :value="deleteText"
          label='To confirm, enter "delete my account" below'
          placeholder="Write those exact words"
          required
          @input="val => (deleteText = val)"
        />
        <button class="button button--color-danger">
          Delete my account
        </button>
      </form>
      <h2>Data Protection Officer</h2>
      <p>
        If you have any questions or concerns about your data or our security
        measures, you can get in touch with our Data Protection Officer.
      </p>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Settings,
    Loading,
    Input
  },
  computed: mapGetters({
    isDownloading: "settings/isDownloading"
  })
})
export default class AccountSettings extends Vue {
  loading = "";
  deleteText = "";
  isDownloading!: boolean;
  isDeleting = false;

  private exportData() {
    this.$store.dispatch("settings/getExport");
  }

  private deleteAccount() {
    if (this.deleteText !== "delete my account") return;
    this.isDeleting = true;
    this.$store
      .dispatch("settings/deleteAccount")
      .then(() => {
        this.$store.dispatch("auth/logout");
        this.$router.push("/errors/user-deleted");
      })
      .catch(error => {
        throw new Error(error);
      })
      .then(() => (this.isDeleting = false));
  }
}
</script>

<style lang="scss" scoped></style>
