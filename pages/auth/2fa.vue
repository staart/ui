<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <Card>
      <h1>Two-factor Authentication</h1>
      <Loading v-if="isLoading" message="Logging you in" />
      <form v-else v-meta-ctrl-enter="login" @submit.prevent="login">
        <Input
          v-model="code"
          type="number"
          autocomplete="one-time-code"
          label="One-time Password"
          placeholder="Enter your one-time password"
          required
          autofocus
        />
        <button
          class="button button--width-full button--size-large"
          type="submit"
        >
          Login to your account
        </button>
      </form>
    </Card>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Input from "@/components/form/Input.vue";
import Loading from "@/components/Loading.vue";
import Card from "@/components/Card.vue";
library.add(faGoogle);

@Component({
  components: {
    Card,
    Loading,
    Input,
    FontAwesomeIcon
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    isLoading: "auth/isLoading"
  })
})
export default class Login extends Vue {
  code = "";
  isAuthenticated!: boolean;
  private login() {
    this.$store
      .dispatch("auth/loginWith2FA", {
        code: this.code,
        token: this.$store.state.auth.tokens.twoFactorToken
      })
      .then(response => {
        this.$router.push("/dashboard");
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.code = "";
      });
  }

  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
}
</script>
