<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="isSent"
      img="undraw_message_sent_1030.svg"
      heading="Check your email"
      text="We've sent you a magic link which will help you recover access to your account."
    />
    <div v-else>
      <Card>
        <h1>Forgot password</h1>
        <form v-meta-ctrl-enter="forgot" @submit.prevent="forgot">
          <Input
            v-model="email"
            type="email"
            label="Email"
            placeholder="Enter your work email"
            autocomplete="authname"
            required
            autofocus
          />
          <button
            class="button button--width-full button--size-large"
            type="submit"
          >
            Send a magic link
          </button>
        </form>
      </Card>
      <p class="text text--mt-1">
        Remembered your password?
        <nuxt-link to="/auth/login">Login now</nuxt-link>
      </p>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Card from "@/components/Card.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";

@Component({
  components: {
    Card,
    LargeMessage,
    Input
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Login extends Vue {
  email = "";
  isAuthenticated!: boolean;
  isSent = false;
  private forgot() {
    this.$store
      .dispatch("auth/sendPasswordResetLink", {
        email: this.email
      })
      .then(() => (this.isSent = true))
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.email = "";
      });
  }

  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
}
</script>
