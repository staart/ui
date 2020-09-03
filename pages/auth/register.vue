<template>
  <div>
    <h1 class="title is-4">Register</h1>
    <div v-if="completed">
      <img alt="" src="/illustrations/PlantDoodle.svg" />
      <h2 class="title is-5">Check your email</h2>
      <p>
        We've sent you a link to verify your email. Once you've clicked on the
        link, you'll be able to log in.
      </p>
      <div v-if="emailDomain">
        <b-button
          tag="a"
          target="_blank"
          :href="`http://${emailDomain}`"
          type="is-primary"
        >
          Go to {{ emailDomain }} &rarr;
        </b-button>
      </div>
      <div v-if="resendTime > -2">
        <p v-if="resendTime !== -1">
          Didn't receive the email? Check your spam folder or resend in
          {{ resendTime }}
          seconds.
        </p>
        <p v-else>Didn't receive the email? We've sent it again.</p>
        <b-button @click.prevent="resend" :disabled="resendTime !== 0">
          <span v-if="resendTime === -1">Resent</span>
          <span v-else>Resend</span>
        </b-button>
      </div>
    </div>
    <div class="content" v-else>
      <form @submit.prevent="register">
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
  email = "anandchowdhary@gmail.com";
  password = "";
  invitedByUser = "";

  completed = false;
  loading = false;
  hasPasswordless = false;
  hasInviteCode = false;
  resendTime = -2;
  resendToken = "";
  timer: any = undefined;

  mounted() {
    this.timer = window.setInterval(() => {
      if (this.resendTime > 0) this.resendTime -= 1;
    }, 1000);
  }

  async register() {
    if (this.loading) return;
    this.loading = true;
    try {
      const { data } = await this.$axios.post("/auth/register", {
        name: this.name,
        email: this.email,
        password: this.password ? this.password : undefined,
        invitedByUser: this.invitedByUser ? this.invitedByUser : undefined
      });
      this.name = "";
      this.password = "";
      this.invitedByUser = "";
      this.completed = true;
      this.resendToken = data.resendToken;
      if (this.resendToken) this.resendTime = 120;
    } catch (error) {}
    this.loading = false;
    this.password = "";
  }

  async resend() {
    try {
      await this.$axios.post("/auth/resend-verification", {
        email: this.email
      });
    } catch (error) {}
    this.resendTime = -1;
  }

  get emailDomain() {
    try {
      return this.email.split("@")[1];
    } catch (error) {
      return "";
    }
  }

  beforeDestroy() {
    window.clearInterval(this.timer);
    this.timer = undefined;
  }
}
</script>
