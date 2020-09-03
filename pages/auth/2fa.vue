<template>
  <div>
    <h1 class="title is-4">Two factor authentication</h1>
    <p>
      Enter the one-time password from your authenticator app. If you don't have
      access to it, you can use a backup code instead.
    </p>
    <form @submit.prevent="login">
      <b-field label="One-time password">
        <b-input
          v-model="code"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          class="otp"
          minlength="6"
          maxlength="6"
          placeholder="••••••"
          autofocus
          required
        />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loading"
        >Login to your account</b-button
      >
      <b-button tag="nuxt-link" to="/">Cancel</b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  middleware: "unauthenticated",
  layout: "auth"
})
export default class Login extends Vue {
  code = "";
  loading = false;

  async login() {
    if (this.loading) return;
    this.loading = true;
    try {
      const { data } = await this.$axios.post("/auth/2fa", {
        token: this.$store.state.auth.tokens.twoFactorToken,
        code: this.code
      });
      const result = await this.$store.dispatch("auth/loginWithTokens", data);
      const memberships = this.$store.state.auth.user.memberships;
      if (!memberships?.data?.length)
        return this.$router.replace("/onboarding/user");
      this.$router.replace(`/teams/${memberships?.data[0]?.groupId}`);
    } catch (error) {}
    this.loading = false;
    this.code = "";
  }
}
</script>

<style>
.otp input.input {
  font-size: 200%;
  letter-spacing: 1rem;
  font-family: monospace;
}
</style>
