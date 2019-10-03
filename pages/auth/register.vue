<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="completedRegistration"
      heading="Check your email"
      img="undraw_message_sent_1030.svg"
      text="We've sent you a special link to complete your registration and activate your account."
    />
    <Card v-else>
      <h1>Register</h1>
      <Loading v-if="isLoading" message="Creating your account" />
      <form v-else v-meta-ctrl-enter="register" @submit.prevent="register">
        <Input
          v-model="name"
          type="text"
          label="Name"
          placeholder="Enter your full name"
          autocomplete="name"
          required
          autofocus
        />
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="email"
          required
        />
        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter a secure password"
          autocomplete="new-password"
          help="Tip: Use a strong password generator"
        />
        <button
          class="button button--width-full button--size-large"
          type="submit"
        >
          Register for an account
        </button>
      </form>
    </Card>
    <p v-if="!completedRegistration" class="text text--mt-1">
      Already have an account?
      <nuxt-link to="/auth/login">Login to your account</nuxt-link>
    </p>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Card from "@/components/Card.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Card,
    LargeMessage,
    Loading,
    Input
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Login extends Vue {
  name = "";
  email = "";
  password = "";
  isAuthenticated!: boolean;
  isLoading = false;
  completedRegistration = false;
  private register() {
    this.isLoading = true;
    this.$store
      .dispatch("auth/register", {
        email: this.email,
        name: this.name,
        password: this.password
      })
      .then(() => {
        this.completedRegistration = true;
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.name = "";
        this.email = "";
        this.password = "";
        this.isLoading = false;
      });
  }
  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
}
</script>
