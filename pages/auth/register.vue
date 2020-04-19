<template>
  <main class="container" style="max-width: 500px; margin: 10vh auto;">
    <LargeMessage
      v-if="completed"
      heading="Check your email"
      img="undraw_message_sent_1030.svg"
      text="We've sent you a special link to complete your registration and activate your account."
    />
    <div v-else class="card">
      <form
        v-meta-ctrl-enter="login"
        class="card-content"
        @submit.prevent="login"
      >
        <b-field label="Name">
          <b-input v-model="name" type="text" required />
        </b-field>
        <b-field label="Email">
          <b-input v-model="email" type="email" required />
        </b-field>
        <b-field label="Password">
          <b-input
            v-model="password"
            type="password"
            required
            password-reveal
          />
        </b-field>
        <div class="field">
          <b-checkbox v-model="hasInviteCode"
            >I have an invitation code</b-checkbox
          >
        </div>
        <b-field v-if="hasInviteCode" label="Invitation code">
          <b-input v-model="invitedByUser" type="text" />
        </b-field>
        <b-button type="is-primary" :loading="isLoading" native-type="submit"
          >Login to your account</b-button
        >
      </form>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import LargeMessage from "@/components/LargeMessage.vue";
import { User } from "../../types/auth";
@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user",
  }),
  components: {
    LargeMessage,
  },
})
export default class Login extends Vue {
  name = "";
  email = "";
  password = "";
  invitedByUser = "";
  hasInviteCode = false;

  isAuthenticated!: boolean;
  user!: User;
  isLoading = false;
  completed = false;

  async login() {
    this.isLoading = true;
    try {
      const response = await this.$store.dispatch("auth/register", {
        name: this.name,
        email: this.email,
        password: this.password,
        invitedByUser: this.invitedByUser ? this.invitedByUser : undefined,
      });
      if (response === "2fa") return this.$router.push("/auth/2fa");
      this.completed = true;
    } catch (error) {}
    this.isLoading = false;
    this.name = "";
    this.email = "";
    this.password = "";
  }

  created() {
    if (this.isAuthenticated)
      return this.$router.replace(
        (this.$route.query.redirect as string) || "/"
      );
  }
}
</script>
