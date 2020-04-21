<template>
  <div>
    <h1 class="title is-4">Login</h1>
    <div class="content">
      <form @submit.prevent="login">
        <b-field label="Email">
          <b-input v-model="email" type="email" required />
        </b-field>
        <b-field label="Password">
          <b-input v-model="password" type="password" password-reveal />
        </b-field>
        <b-button type="is-primary" native-type="submit" :loading="loading"
          >Login to your account</b-button
        >
      </form>
      <p style="margin-top: 1rem">
        <a href="#">Forgot your password?</a>
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

  async login() {
    if (this.loading) return;
    this.loading = true;
    try {
      const { data }: { data: any } = await this.$axios.post("/auth/login", {
        email: this.email,
        password: this.password
      });
      const result = await this.$store.dispatch("auth/loginWithTokens", data);
      if (result === "2fa") return this.$router.replace("/auth/2fa");
      const memberships = this.$store.state.auth.user.memberships;
      if (!memberships?.data?.length)
        return this.$router.replace("/onboarding/user");
      this.$router.replace(
        `/teams/${memberships?.data[0]?.organization?.username}`
      );
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
}
</script>
