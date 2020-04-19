<template>
  <main class="container" style="max-width: 500px; margin: 10vh auto;">
    <div class="card">
      <form
        v-meta-ctrl-enter="login"
        class="card-content"
        @submit.prevent="login"
      >
        <b-field label="Email">
          <b-input v-model="email" type="email" required />
        </b-field>
        <b-field label="Password">
          <b-input v-model="password" type="password" required />
        </b-field>
        <b-button type="is-primary" :loading="isLoading" native-type="submit"
          >Login to your account</b-button
        >
      </form>
    </div>
    <div class="row text text--mt-1">
      <nuxt-link to="/auth/forgot">Forgot your password?</nuxt-link>
      <nuxt-link to="/auth/register" style="text-align: right;"
        >Create an account</nuxt-link
      >
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { User } from "../../types/auth";
@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user",
  }),
})
export default class Login extends Vue {
  email = "";
  password = "";
  isAuthenticated!: boolean;
  user!: User;
  isLoading = false;

  async login() {
    this.isLoading = true;
    const response = await this.$store.dispatch("auth/loginWithEmailPassword", {
      email: this.email,
      password: this.password,
    });
    if (response === "2fa") return this.$router.push("/auth/2fa");
    this.isLoading = false;
    this.email = "";
    this.password = "";
  }

  created() {
    if (this.isAuthenticated)
      return this.$router.replace(
        (this.$route.query.redirect as string) || "/"
      );
  }
}
</script>
