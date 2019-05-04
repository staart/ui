<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <Card>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="authname"
          required
        />
        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
        />
        <button
          class="button button--width-full button--size-large button--color-primary"
          type="submit"
        >
          Login to your account
        </button>
        <p style="text-align: center">
          <em>or</em>
        </p>
        <button
          class="button button--width-full button--size-large button--color-blue"
          type="button"
          style="margin-top: 1rem"
        >
          Login with Google
        </button>
      </form>
    </Card>
    <p>Don't have an account? <nuxt-link to="/auth/register">Create an account</nuxt-link></p>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Input from "@/components/form/Input.vue";
import { mapGetters } from "vuex";

@Component({
  components: {
    Card,
    Input
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Login extends Vue {
  email = "";
  password = "";
  isAuthenticated!: boolean;
  private login() {
    this.$store
      .dispatch("auth/loginWithEmailPassword", {
        email: this.email,
        password: this.password
      })
      .then(() => {
        this.$router.push("/dashboard");
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.email = "";
        this.password = "";
      });
  }
  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
}
</script>
