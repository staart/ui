<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="hasError"
      heading="That's not good"
      text="We got an error in verifying this magic link. Please make sure this link isn't expired."
      cta-text="Go to login"
      img="undraw_cancel_u1it.svg"
      cta-to="/auth/login"
    />
    <LargeMessage
      v-else-if="hasSuccess"
      :heading="successMessage().heading"
      :text="successMessage().text"
      :cta-text="ctaText"
      :cta-to="ctaTo"
      img="undraw_confirmation_2uy0.svg"
    />
    <LargeMessage
      v-else
      img="undraw_loading_frh4.svg"
      heading="Just a moment"
      text="We're verifying this magic link and you should be on your way in just another moment."
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import LargeMessage from "@/components/LargeMessage.vue";

@Component({
  components: {
    LargeMessage
  }
})
export default class Token extends Vue {
  hasError = false;
  hasSuccess = false;
  ctaText = "Go to login";
  ctaTo = "/auth/login";
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
    if (this.$store.state.auth.isAuthenticated) {
      this.ctaText = "Go to dashboard";
      this.ctaTo = "/";
    }
    if (!token || !subject) return (this.hasError = true);
    this.$store
      .dispatch(`tokens/${this.tokenAction()}`, { token, subject })
      .then(result => {
        this.hasSuccess = true;
      })
      .then(() => {
        if (
          subject === "approve-location" &&
          this.$store.state.auth.isAuthenticated
        ) {
          this.$router.replace("/dashboard");
        } else if (subject === "password-reset") {
          this.$router.replace(`/auth/recover?token=${token}`);
        } else if (subject === "auth") {
          this.$store
            .dispatch("auth/loginWithTokens", this.$route.query)
            .then(response => {
              if (response === "2fa") {
                this.$router.push("/auth/2fa");
              } else {
                this.$router.push("/dashboard");
              }
            });
        }
      })
      .catch(error => {
        this.hasError = true;
        throw new Error(error);
      });
  }
}
</script>
