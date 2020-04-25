<template>
  <div>
    <h1 class="title is-4 has-text-centered">Register</h1>
    <div v-if="completed" class="has-text-centered">
      <img alt="" src="/illustrations/PlantDoodle.svg" />
      <h2 class="title is-5">Check your email</h2>
      <p>
        We've sent you an email to verify your account. Once you've clicked on
        the magic link, you can log in.
      </p>
      <div v-if="emailDomain" style="margin-top: 1rem">
        <b-button
          tag="a"
          target="_blank"
          :href="`http://${emailDomain}`"
          type="is-primary"
        >
          Go to {{ emailDomain }} &rarr;
        </b-button>
      </div>
    </div>
    <div class="content" v-else>
      <form @submit.prevent="login">
        <b-field label="Name">
          <b-input v-model="name" type="text" required />
        </b-field>
        <b-field label="Email">
          <b-input v-model="email" type="email" required />
        </b-field>
        <b-field v-show="!hasPasswordless" label="Password">
          <b-input v-model="password" type="password" password-reveal />
        </b-field>
        <b-field>
          <b-checkbox v-model="hasPasswordless">
            <span>Use passwordless login</span>
            <b-tooltip label="We'll send you a magic link over email">
              <b-icon icon="help-circle" size="is-small" />
            </b-tooltip>
          </b-checkbox>
        </b-field>
        <b-field>
          <b-checkbox v-model="hasInviteCode">
            I have an invitation code
          </b-checkbox>
        </b-field>
        <b-field v-show="hasInviteCode" label="Invitation code">
          <b-input v-model="invitedByUser" type="text" />
        </b-field>
        <b-button type="is-primary" native-type="submit" :loading="loading">
          Create an account
        </b-button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  middleware: "unauthenticated",
  layout: "auth"
})
export default class Register extends Vue {
  name = "";
  email = "";
  password = "";
  invitedByUser = "";

  completed = false;
  loading = false;
  hasPasswordless = false;
  hasInviteCode = false;

  async login() {
    if (this.loading) return;
    this.loading = true;
    try {
      await this.$axios.post("/auth/register", {
        name: this.name,
        email: this.email,
        password: this.password ? this.password : undefined,
        invitedByUser: this.invitedByUser ? this.invitedByUser : undefined
      });
      this.name = "";
      this.password = "";
      this.invitedByUser = "";
      this.completed = true;
    } catch (error) {
      this.$buefy.toast.open({
        message: error?.response?.data?.error,
        type: "is-danger"
      });
    }
    this.loading = false;
    this.email = "";
    this.password = "";
  }

  get emailDomain() {
    try {
      return this.email.split("@")[1];
    } catch (error) {
      return "";
    }
  }
}
</script>
