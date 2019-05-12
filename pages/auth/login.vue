<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <Card>
      <h1>Login</h1>
      <Loading v-if="isLoading" message="Logging you in" />
      <form v-else @submit.prevent="login">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="authname"
          required
        />
        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autocomplete="current-password"
          required
        />
        <button
          class="button button--width-full button--size-large"
          type="submit"
        >
          Login to your account
        </button>
        <button
          class="button button--width-full button--size-large button--color-blue"
          type="button"
          style="margin-top: 1rem"
          @click="loginWithGoogle"
        >
          <font-awesome-icon
            class="icon icon--mr-1"
            :icon="['fab', 'google']"
          />
          Login with Google
        </button>
      </form>
    </Card>
    <div class="row section section--mt-1">
      <nuxt-link to="/auth/forgot">Forgot your password?</nuxt-link>
      <nuxt-link to="/auth/register">Create an account</nuxt-link>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
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
  email = "";
  password = "";
  isAuthenticated!: boolean;
  private login() {
    this.$store
      .dispatch("auth/loginWithEmailPassword", {
        email: this.email,
        password: this.password
      })
      .then(() => {
        this.$router.push("/dashboard");
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.email = "";
        this.password = "";
      });
  }
  private created() {
    if (this.isAuthenticated) return this.$router.replace("/dashboard");
  }
  private async loginWithGoogle() {
    this.$store.commit("auth/startLoading");
    const link = (await this.$axios.get("/auth/google/link")).data.redirect;
    location.replace(link);
  }
}
</script>
