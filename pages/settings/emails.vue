<template>
  <main>
    <Settings>
      <h1>Emails</h1>
      <p>
        You can login to your account with any of the following verified emails.
      </p>
      <Loading v-if="loading" :message="loading" />
      <div v-else>
        <table class="table">
          <tbody>
            <tr v-for="(email, index) in emails" :key="`${email.id}_${index}`">
              <td>
                {{ email.email
                }}<span
                  v-if="email.isPrimary"
                  data-balloon="Primary"
                  data-balloon-pos="up"
                >
                  <font-awesome-icon
                    title="Primary"
                    class="icon icon--ml-2 icon--color-gold"
                    icon="star"
                  /> </span
                ><span
                  v-if="email.isVerified && !email.isPrimary"
                  data-balloon="Verified"
                  data-balloon-pos="up"
                >
                  <font-awesome-icon
                    title="Verified"
                    class="icon icon--ml-2 icon--color-success"
                    icon="check-circle"
                  />
                </span>
                <span
                  v-else-if="!email.isVerified"
                  data-balloon="Unverified"
                  data-balloon-pos="up"
                >
                  <font-awesome-icon
                    title="Unverified"
                    class="icon icon--ml-2 icon--color-danger"
                    icon="exclamation-circle"
                  />
                </span>
              </td>
              <td class="text text--align-right">
                <button
                  v-if="!email.isPrimary && email.isVerified"
                  data-balloon="Make primary"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  @click="makePrimary(email.id)"
                >
                  <font-awesome-icon
                    title="Make primary"
                    class="icon icon--color-gold"
                    icon="star"
                    fixed-width
                  />
                </button>
                <button
                  v-if="!email.isPrimary"
                  data-balloon="Delete"
                  data-balloon-pos="up"
                  class="button button--color-danger button--type-icon"
                  @click="deleteEmail(email.id)"
                >
                  <font-awesome-icon
                    title="Delete"
                    class="icon icon--color-danger"
                    icon="trash"
                    fixed-width
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Add another email</h2>
        <form @submit.prevent="addEmail">
          <Input
            :value="newEmail"
            type="email"
            label="Email"
            placeholder="Enter another one of your emails"
            required
            @input="val => (newEmail = val)"
          />
          <button class="button">
            Add another email
          </button>
        </form>
        <h2>Email notifications</h2>
        <p>Emails only will be sent to your primary email.</p>
        <form @submit.prevent="saveNotifications">
          <Select
            :value="notificationEmails"
            label="Notification types"
            help="Select the type of email notifications do you want to receive"
            :options="notificationOptions"
            required
            @input="val => (notificationEmails = val)"
          />
          <button class="button">
            Update preferences
          </button>
        </form>
      </div>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faExclamationCircle,
  faStar,
  faTrash,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { Email } from "@/types/settings";
library.add(faExclamationCircle, faStar, faTrash, faCheckCircle);

@Component({
  components: {
    Settings,
    Loading,
    Select,
    Input,
    FontAwesomeIcon
  },
  computed: mapGetters({
    emails: "settings/emails",
    notificationEmailsGetter: "settings/notificationEmails"
  })
})
export default class AccountSettings extends Vue {
  loading = "";
  newEmail = "";
  notificationEmails = 0;
  emails!: Email[];
  notificationEmailsGetter!: number;
  notificationOptions = {
    0: "Only mandatory security-related emails",
    1: "All account-related and mandatory security emails",
    2: "All non-promotional emails",
    3: "All emails, including promotional ones"
  };

  @Watch("notificationEmailsGetter")
  onNotificationEmailsChanged(value: number) {
    this.notificationEmails = value;
  }

  private mounted() {
    this.loading = "Loading emails";
    this.notificationEmails = this.notificationEmailsGetter;
    this.$store.dispatch("settings/getUser");
    this.$store.dispatch("settings/getEmails").then(() => {
      this.loading = "";
    });
  }

  private addEmail() {
    this.loading = "Adding email";
    this.$store
      .dispatch("settings/addEmail", { email: this.newEmail })
      .then(() => {})
      .catch(() => {})
      .then(() => (this.loading = ""));
    this.newEmail = "";
  }

  private deleteEmail(id: number) {
    if (!confirm("Are you sure you want to delete this email?")) return;
    this.loading = "Deleting email";
    this.$store
      .dispatch("settings/deleteEmail", id)
      .then(() => (this.loading = ""));
  }

  private makePrimary(id: number) {
    this.loading = "Setting primary email";
    this.$store.dispatch("settings/makeEmailPrimary", id).then(() => {
      this.loading = "";
      this.$store.dispatch("auth/refresh");
    });
  }

  private saveNotifications() {
    this.loading = "Saving preferences";
    this.$store
      .dispatch("settings/updateUser", {
        notificationEmails: this.notificationEmails
      })
      .then(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
