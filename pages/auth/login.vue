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
        <no-ssr>
          <p class="text text--align-center text--color-light or">
            or, login with:
          </p>
          <div class="row">
            <button
              v-for="service in ['apple', 'google']"
              :key="`login_${service}`"
              class="button button--width-full button--size-large button--color-blue"
              type="button"
              :aria-label="`Login with ${service}`"
              @click="loginWithGoogle"
            >
              <font-awesome-icon
                v-if="service !== 'more'"
                class="icon"
                :icon="['fab', service]"
                fixed-width
              />
            </button>
            <button
              class="button button--width-full button--size-large button--color-blue"
              style="width: 20%"
              type="button"
              aria-label="More services"
              data-balloon="More services"
              data-balloon-pos="down"
              @click="() => (showMore = true)"
            >
              <font-awesome-icon class="icon" icon="ellipsis-h" fixed-width />
            </button>
          </div>
        </no-ssr>
      </form>
    </Card>
    <div class="row section section--mt-1">
      <nuxt-link to="/auth/forgot">Forgot your password?</nuxt-link>
      <nuxt-link to="/auth/register" style="text-align: right"
        >Create an account</nuxt-link
      >
    </div>
    <transition name="modal">
      <Modal v-if="showMore" :on-close="() => (showMore = false)">
        <h2>Login with third-party services</h2>
        <p>
          You can securely login with these services. We never share your
          personal information with third-parties.
        </p>
        <div>
          <button
            v-for="service in [
              'Google',
              'Salesforce',
              'Microsoft',
              'Facebook',
              'Twitter',
              'LinkedIn'
            ]"
            :key="`option_${service}`"
            class="button button--width-full button--size-large button--color-blue button--type-list"
            type="button"
            @click="loginWithGoogle"
          >
            <font-awesome-icon
              v-if="service !== 'more'"
              class="icon"
              :icon="['fab', service.toLowerCase()]"
              fixed-width
            />
            <span>{{ service }}</span>
          </button>
        </div>
      </Modal>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Modal from "@/components/Modal.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGoogle,
  faSalesforce,
  faFacebook,
  faMicrosoft,
  faTwitter,
  faLinkedin,
  faApple
} from "@fortawesome/free-brands-svg-icons";
import { faDotCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
library.add(
  faGoogle,
  faSalesforce,
  faFacebook,
  faMicrosoft,
  faApple,
  faDotCircle,
  faEllipsisH,
  faTwitter,
  faLinkedin
);

interface IWindow extends Window {
  AppleID: any;
}

@Component({
  components: {
    Modal,
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
  showMore = false;
  redirect: string | undefined = "";
  private login() {
    this.$store
      .dispatch("auth/loginWithEmailPassword", {
        email: this.email,
        password: this.password
      })
      .then(response => {
        if (response === "2fa") return this.$router.push("/auth/2fa");
        this.$router.push(this.redirect || "/dashboard");
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
    this.redirect = this.$route.query.redirect as string | undefined;
    if (this.isAuthenticated)
      return this.$router.replace(this.redirect || "/dashboard");
  }
  private async loginWithGoogle() {
    this.$store.commit("auth/startLoading");
    const link = (await this.$axios.get("/auth/google/link")).data.redirect;
    location.replace(link);
  }
}
</script>

<style lang="scss" scoped>
.or {
  text-align: center;
  margin: 1rem 0;
}
</style>
