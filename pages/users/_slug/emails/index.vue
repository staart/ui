<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Emails</h1>
        <div class="text text--align-right">
          <button
            aria-label="Refresh"
            data-balloon-pos="down"
            class="button button--type-icon"
            @click="load"
          >
            <font-awesome-icon class="icon" icon="sync" fixed-width />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="!loading && (!emails || !emails.data || !emails.data.length)"
        heading="No emails yet"
        img="undraw_software_engineer_lvl5.svg"
        text="Add an email below"
      />
      <div v-else-if="emails && emails.data && emails.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(email, index) in emails.data"
              :key="`${email.id}_${index}`"
            >
              <td>
                <span>{{ email.email }}</span>
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
              <td><TimeAgo :date="email.createdAt" /></td>
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
                    class="icon"
                    icon="star"
                    fixed-width
                  />
                </button>
                <button
                  v-if="!email.isVerified"
                  aria-label="Resend verification"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  @click="() => (showResend = email)"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="envelope-open"
                    fixed-width
                  />
                </button>
                <button
                  aria-label="Delete email"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = email)"
                >
                  <font-awesome-icon class="icon" icon="trash" fixed-width />
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
      </div>
      <h2>Add another email</h2>
      <p>
        You can add all your other email addresses.
      </p>
      <form @submit.prevent="createEmail">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email address"
          :value="newEmail"
          @input="val => (newEmail = val)"
        />
        <button class="button">Add email</button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want delete this email?</h2>
        <p>
          Deleting an email is not reversible, and you'll need to verify this
          email again if you add it back
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteEmail(showDelete.id)"
        >
          Yes, delete email
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't leave
        </button>
      </Confirm>
    </transition>
    <transition name="modal">
      <Confirm v-if="showResend" :on-close="() => (showResend = null)">
        <h2>Make sure you've checked your email</h2>
        <p>
          We've already sent you a link to verify your email. Make sure you've
          looked in your Spam or Junk folders before requesting another link.
        </p>
        <button
          class="button button--state-cta"
          @click="resendEmail(showResend.id)"
        >
          Yes, resend verification
        </button>
        <button type="button" class="button" @click="showResend = null">
          No, don't resend
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSync,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Emails, emptyPagination, Email } from "@/types/users";
library.add(
  faArrowDown,
  faSync,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
);

@Component({
  components: {
    Loading,
    Confirm,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  emails: Emails = emptyPagination;
  showResend: Email | null = null;
  showDelete: Email | null = null;
  loadingMore = false;
  loading = "";
  newEmail = "";

  private created() {
    this.emails = {
      ...this.$store.getters["users/emails"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading your emails";
    this.$store
      .dispatch("users/getEmails", { slug: this.$route.params.slug })
      .then(emails => {
        this.emails = { ...emails };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("users/getEmails", {
        slug: this.$route.params.slug,
        start: this.$store.state.users.emails[this.$route.params.slug].next
      })
      .then(() => {
        this.emails = {
          ...this.$store.getters["users/emails"](this.$route.params.slug)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private createEmail() {
    this.loading = "Creating your email";
    this.$store
      .dispatch("users/createEmail", {
        email: this.newEmail,
        slug: this.$route.params.slug
      })
      .then(emails => {
        this.emails = { ...emails };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newEmail = "";
      });
  }

  private deleteEmail(key: number) {
    this.showDelete = null;
    this.loading = "Deleting email";
    this.$store
      .dispatch("users/deleteEmail", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(emails => {
        this.emails = { ...emails };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private resendEmail(key: number) {
    this.showResend = null;
    this.loading = "Resending verification email";
    this.$store
      .dispatch("users/resendEmail", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(() => {})
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private makePrimary(key: number) {
    this.loading = "Setting primary email";
    this.$store
      .dispatch("users/updateUser", {
        slug: this.$route.params.slug,
        primaryEmail: key
      })
      .then(emails => {
        this.emails = { ...emails };
      })
      .then(() => this.$store.dispatch("auth/refresh"))
      .catch(error => {
        throw new Error(error);
      })
      .then(() => this.load());
  }
}
</script>

<style lang="scss" scoped></style>
