<template>
  <main>
    <h1>Emails</h1>
    <p>
      You can login to your account with any of the following verified emails.
    </p>
    <Loading v-if="loading" :message="loading" />
    <div v-else-if="emails">
      <table class="table">
        <thead>
          <tr>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(email, index) in emails.data"
            :key="`${email.id}_${index}`"
          >
            <td>
              {{ email.email }}
              <span
                v-if="email.isVerified"
                aria-label="Verified"
                data-balloon-pos="up"
              >
                <font-awesome-icon
                  title="Verified"
                  class="icon icon--ml-2 icon--color-success"
                  icon="check-circle"
                />
              </span>
              <span
                v-if="email.isPrimary"
                aria-label="Primary"
                data-balloon-pos="up"
              >
                <font-awesome-icon
                  title="Primary"
                  class="icon icon--ml-2 icon--color-gold"
                  icon="star"
                />
              </span>
              <span
                v-else-if="!email.isVerified"
                aria-label="Unverified"
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
                aria-label="Make primary"
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
                aria-label="Delete"
                data-balloon-pos="up"
                class="button button--color-danger button--type-icon"
                @click="showDelete = email"
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
      <div class="pagination text text--align-center">
        <button
          v-if="emails && emails.hasMore"
          class="button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span>Load more emails</span>
          <font-awesome-icon
            v-if="!loadingMore"
            class="icon"
            icon="arrow-down"
          />
          <font-awesome-icon
            v-else
            class="icon icon--ml-2 icon--color-light"
            icon="sync"
            spin
          />
        </button>
      </div>
      <h2>Add another email</h2>
      <form v-meta-ctrl-enter="addEmail" @submit.prevent="addEmail">
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
      <form
        v-meta-ctrl-enter="saveNotifications"
        @submit.prevent="saveNotifications"
      >
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
      <transition name="modal">
        <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
          <h2>Are you sure you want to delete {{ showDelete.email }}?</h2>
          <p>
            You won't be able to log in with this email anymore.
          </p>
          <button
            class="button button--color-danger-cta"
            @click="deleteEmail(showDelete.id)"
          >
            Yes, delete this email
          </button>
          <button type="button" class="button" @click="showDelete = null">
            No, don't delete
          </button>
        </Confirm>
      </transition>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faExclamationCircle,
  faStar,
  faTrash,
  faCheckCircle,
  faArrowDown,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Confirm from "@/components/Confirm.vue";
import { Email } from "@/types/settings";
library.add(
  faExclamationCircle,
  faStar,
  faTrash,
  faCheckCircle,
  faArrowDown,
  faSync
);

@Component({
  components: {
    Loading,
    Select,
    Input,
    Confirm,
    FontAwesomeIcon
  },
  computed: mapGetters({
    emails: "settings/emails",
    notificationEmailsGetter: "settings/notificationEmails"
  }),
  middleware: "auth"
})
export default class AccountSettings extends Vue {
  loading = "";
  newEmail = "";
  notificationEmails = 0;
  showDelete = null;
  emails!: Email[];
  loadingMore = false;
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
  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("settings/getEmails", this.$store.state.emails.start)
      .then(() => {
        this.loadingMore = false;
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
    this.showDelete = null;
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
