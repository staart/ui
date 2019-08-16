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
      v-else
      img="undraw_loading_frh4.svg"
      heading="Just a moment"
      text="We're verifying this login and you should be on your way in just another moment."
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
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Token extends Vue {
  hasError = false;
  isAuthenticated!: boolean;
  hasSuccess = false;
  ctaText = "Go to login";
  ctaTo = "/auth/login";
  redirect: string | undefined = "";
  private created() {
    this.redirect = this.$route.query.redirect as string | undefined;
    if (this.isAuthenticated)
      return this.$router.replace(this.redirect || "/dashboard");
  }
  private mounted() {
    this.$store
      .dispatch("auth/setAuthTokens", this.$route.query)
      .then(response => {
        if (response === "2fa") {
          this.$router.push("/auth/2fa");
        } else {
          this.$router.push(this.redirect || "/dashboard");
        }
      })
      .catch(error => {
        this.hasError = false;
        throw new Error(error);
      });
  }
}
</script>
