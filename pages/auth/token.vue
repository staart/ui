<template>
  <div v-if="state === 'loading'">
    <h1 class="title is-4">Loading...</h1>
    <div class="content"></div>
  </div>
  <div v-else-if="state === 'success'">
    <h1 v-if="subject === 'email-verify'" class="title is-4">Email verified</h1>
    <h1 v-else class="title is-4">Success</h1>
    <div class="content">
      <p v-if="subject === 'email-verify'">
        Your email was successfully verified.
      </p>
      <b-button v-if="isAuthenticated" tag="nuxt-link" to="/" type="is-primary"
        >Go to dashboard &rarr;</b-button
      >
      <b-button v-else tag="nuxt-link" to="/auth/login" type="is-primary"
        >Go to login &rarr;</b-button
      >
    </div>
  </div>
  <div v-else>
    <h1 class="title is-4">Error</h1>
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  middleware: "unauthenticated",
  layout: "auth",
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Login extends Vue {
  state = "loading";
  subject = "";
  isAuthenticated!: boolean;

  get tokenEndpoint() {
    switch (this.$route.query.subject) {
      case "email-verify":
        return "/auth/verify-email";
      case "approve-location":
        return "/auth/approve-location";
      case "login":
        return "/auth/login-link";
      default:
        return "/auth/verify-token";
    }
  }

  async mounted() {
    const token = this.$route.query.token;
    this.subject =
      typeof this.$route.query.subject === "string"
        ? this.$route.query.subject
        : "";
    if (!token || !this.subject) return (this.state = "error");

    try {
      const { data }: { data: any } = await this.$axios.post(
        this.tokenEndpoint,
        {
          token
        }
      );
      if (this.subject === "password-reset")
        return this.$router.replace(`/auth/recover?token=${token}`);
      if (this.subject === "login") {
        await this.$store.dispatch("auth/loginWithTokens", data);
        const memberships = this.$store.state.auth.user.memberships;
        if (!memberships?.data?.length)
          return this.$router.replace("/onboarding/user");
        this.$router.replace(`/teams/${memberships?.data[0]?.groupId}`);
      }
      this.state = "success";
    } catch (error) {}
  }
}
</script>
