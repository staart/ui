<template>
  <div>
    <h1 class="title is-4">Login</h1>
    <div class="content">
      <form @submit.prevent="login">
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
        <b-button type="is-primary" native-type="submit" :loading="loading">
          <span v-if="hasPasswordless">Send a login link</span>
          <span v-else>Login to your account</span>
        </b-button>
      </form>
      <p>
        <nuxt-link to="/auth/forgot">Forgot your password?</nuxt-link>
      </p>
      <p>
        <nuxt-link to="/auth/register">Create an account</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  middleware: "unauthenticated",
  layout: "auth"
})
export default class Login extends Vue {
  email = "";
  password = "";

  loading = false;
  hasPasswordless = false;

  async login() {
    if (this.loading) return;
    this.loading = true;
    try {
      const { data }: { data: any } = await this.$axios.post("/auth/login", {
        email: this.email,
        password: this.hasPasswordless ? undefined : this.password
      });
      if (data.message === "login-link-sent") {
        this.$buefy.toast.open({
          message: "We've sent you a login link on your email",
          type: "is-success"
        });
      } else {
        const result = await this.$store.dispatch("auth/loginWithTokens", data);
        if (result === "2fa") return this.$router.replace("/auth/2fa");
        const memberships = this.$store.state.auth.user.memberships;
        if (!memberships?.data?.length)
          return this.$router.replace("/onboarding/user");
        this.$router.replace(`/teams/${memberships?.data[0]?.groupId}`);
      }
    } catch (error) {}
    this.loading = false;
    this.email = "";
    this.password = "";
  }
}
</script>
