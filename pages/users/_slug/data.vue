<template>
  <main>
    <h2>Export data</h2>
    <p>
      You can download an export of your data in JSON format. This will help you
      keep track of what we have and transfer your settings to other apps.
    </p>
    <Loading v-if="isDownloading" message="Generating your export" />
    <form v-else @submit.prevent="exportData">
      <button class="button">
        Export my data
      </button>
    </form>
    <h2>Delete account</h2>
    <p>
      You can delete your Staart account. Note that this action is not
      reversible, and all your data will be permanently lost. If you ever change
      your mind, you'll have to create a new account.
    </p>
    <Loading v-if="isDeleting" message="Deleting your account" />
    <form v-else @submit.prevent="showDelete = true">
      <button class="button button--color-danger">
        Delete my account
      </button>
    </form>
    <h2>Data Protection Officer</h2>
    <p>
      If you have any questions or concerns about your data or our security
      measures, you can get in touch with our Data Protection Officer.
    </p>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>Are you sure you want to delete your account?</h2>
        <p>Deleting your account is not reversible.</p>
        <form @submit.prevent="deleteAccount">
          <Input
            :value="deleteText"
            label='To confirm, enter "delete my account" below'
            placeholder="Write those exact words"
            required
            @input="val => (deleteText = val)"
          />
          <button class="button button--color-danger button--state-cta">
            Yes, delete my account
          </button>
          <button type="button" class="button" @click="showDelete = false">
            No, don't delete
          </button>
        </form>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Loading,
    Confirm,
    Input
  },
  middleware: "auth"
})
export default class AccountSettings extends Vue {
  loading = "";
  deleteText = "";
  isDownloading: boolean = false;
  showDelete = false;
  isDeleting = false;

  private exportData() {
    this.isDownloading = true;
    this.$store
      .dispatch("users/getExport", { slug: this.$route.params.slug })
      .then(() => {})
      .catch(() => {})
      .then(() => (this.isDownloading = false));
  }

  private deleteAccount() {
    if (this.deleteText !== "delete my account") return;
    this.showDelete = false;
    this.isDeleting = true;
    this.$store
      .dispatch("users/deleteAccount", { slug: this.$route.params.slug })
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
