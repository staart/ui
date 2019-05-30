<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="hasError"
      heading="That's not good"
      text="We got an error in verifying your login with Google. This happens if you revoked our access to your account."
      cta-text="Go to login"
      cta-to="/auth/login"
    />
    <LargeMessage
      v-else
      heading="Just a moment"
      text="We're verifying your account and you should be logged in any second now."
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
  ctaText = "Go to login";
  ctaTo = "/auth/login";
  private mounted() {
    const code = this.$route.query.code;
    if (this.$store.state.auth.isAuthenticated) {
      this.ctaText = "Go to dashboard";
      this.ctaTo = "/";
    }
    this.$store
      .dispatch(`auth/loginWithGoogle`, { code })
      .then(response => {
        if (response === "2fa") return this.$router.push("/auth/2fa");
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
