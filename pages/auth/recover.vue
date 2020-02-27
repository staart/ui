<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="isSent"
      img="undraw_message_sent_1030.svg"
      heading="We're good to go"
      text="We've changed your password and you can login to your dashboard now"
      cta-text="Go to login"
      cta-to="/auth/login"
    />
    <div v-else>
      <Card>
        <h1>Reset password</h1>
        <form v-meta-ctrl-enter="forgot" @submit.prevent="forgot">
          <input hidden type="text" autocomplete="username" />
          <Input
            v-model="password"
            type="password"
            label="New password"
            placeholder="Enter a new password"
            autocomplete="new-password"
            required
            autofocus
          />
          <button
            class="button button--width-full button--size-large"
            type="submit"
          >
            Reset your password
          </button>
        </form>
      </Card>
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
  password = "";
  isAuthenticated!: boolean;
  isSent = false;
  private forgot() {
    this.$store
      .dispatch("auth/resetPassword", {
        password: this.password,
        token: this.$route.query.token
      })
      .then(() => (this.isSent = true))
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.password = "";
      });
  }

  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
}
</script>
