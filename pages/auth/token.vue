<template>
  <main class="container container--size-small container--top-20height">
    <LargeMessage
      v-if="hasError"
      heading="That's not good"
      text="We got an error in verifying this magic link. Please make sure this link isn't expired."
      cta-text="Go to login"
      cta-to="/auth/login"
    />
    <LargeMessage
      v-else-if="hasSuccess"
      :heading="successMessage().heading"
      :text="successMessage().text"
      cta-text="Go to login"
      cta-to="/auth/login"
    />
    <LargeMessage
      v-else
      heading="Just a moment"
      text="We're verifying this magic link and you should be on your way in just another moment."
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LargeMessage from "@/components/LargeMessage.vue";
import { mapGetters } from "vuex";

@Component({
  components: {
    LargeMessage
  }
})
export default class Token extends Vue {
  hasError = false;
  hasSuccess = false;
  private successMessage() {
    switch (this.$route.query.subject) {
      case "email-verify":
        return {
          heading: "Email verified",
          text:
            "We've successfully verified your new email and you can login to your account now."
        };
      default:
        return {
          heading: "Success!",
          text:
            "We've verified this magic link and you can continue to your account now."
        };
    }
  }
  private tokenAction() {
    switch (this.$route.query.subject) {
      case "email-verify":
        return "verifyEmail";
      case "approve-location":
        return "approveLocation";
      default:
        return "verify";
    }
  }
  private mounted() {
    const token = this.$route.query.token;
    const subject = this.$route.query.subject;
    if (!token || !subject) return (this.hasError = true);
    this.$store
      .dispatch(`tokens/${this.tokenAction()}`, { token, subject })
      .then(result => {
        this.hasSuccess = true;
      })
      .then(() => {
        if (this.$store.state.auth.isAuthenticated)
          return this.$router.replace("/dashboard");
      })
      .catch(error => {
        this.hasError = true;
        throw new Error(error);
      });
  }
}
</script>
