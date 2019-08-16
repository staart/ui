<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="hasError"
      img="undraw_cancel_u1it.svg"
      heading="That's not good"
      text="We couldn't verify your login. This happens if you revoked our access to your third-party account."
      cta-text="Try another login method"
      cta-to="/auth/login"
    />
    <LargeMessage
      v-else
      img="undraw_loading_frh4.svg"
      heading="Just a moment"
      text="We're verifying your account and you should be logged in any second now."
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
  private mounted() {
    const service = this.$route.params.service;
    const code = location.href;
    if (this.$store.state.auth.isAuthenticated) {
      this.ctaText = "Go to dashboard";
      this.ctaTo = "/";
    }
    console.log("Code is", code);
    this.$store
      .dispatch(`auth/oauthLogin`, { code, service })
      .then(response => {
        if (response === "2fa") {
          this.$router.push("/auth/2fa");
        }
        if (this.$store.state.auth.isAuthenticated) {
          this.$router.replace("/dashboard");
        }
      })
      .catch(error => {
        this.hasError = true;
        throw new Error(error);
      });
  }
}
</script>
