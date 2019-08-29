<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <Card>
      <h1>Login</h1>
      <Loading v-if="isLoading" message="Logging you in" />
      <form v-else v-meta-ctrl-enter="login" @submit.prevent="login">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your work email"
          autocomplete="authname"
          autofocus
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
        <client-only>
          <div class="row text text--mt-1">
            <button
              v-for="service in ['Google', 'Apple', 'Salesforce']"
              :key="`login_${service}`"
              :class="
                `button button--width-full button--size-large button--color-info button--color-brand-${service.toLowerCase()}`
              "
              type="button"
              :aria-label="`Login with ${service}`"
              data-balloon-pos="down"
              @click="oauthLogin(service.toLowerCase())"
            >
              <font-awesome-icon
                v-if="service !== 'more'"
                class="icon"
                :icon="['fab', service.toLowerCase()]"
                fixed-width
              />
            </button>
            <button
              class="button button--width-full button--size-large button--color-info"
              style="width: 20%"
              type="button"
              aria-label="More services"
              data-balloon-pos="down"
              @click="() => (showMore = true)"
            >
              <font-awesome-icon class="icon" icon="ellipsis-h" fixed-width />
            </button>
          </div>
        </client-only>
      </form>
    </Card>
    <div class="row text text--mt-1">
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
        <div class="social-buttons">
          <button
            v-for="service in [
              'Apple',
              'Google',
              'Salesforce',
              'Microsoft',
              'Facebook',
              'GitHub',
              'Weixin'
            ]"
            :key="`option_${service}`"
            class="button"
            type="button"
            @click="oauthLogin(service.toLowerCase())"
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
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGoogle,
  faSalesforce,
  faFacebook,
  faMicrosoft,
  faApple,
  faWeixin,
  faGithub
} from "@fortawesome/free-brands-svg-icons";
import { faDotCircle, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import Input from "@/components/form/Input.vue";
import Loading from "@/components/Loading.vue";
import Modal from "@/components/Modal.vue";
import Card from "@/components/Card.vue";
library.add(
  faGoogle,
  faSalesforce,
  faFacebook,
  faMicrosoft,
  faApple,
  faDotCircle,
  faEllipsisH,

  faWeixin,
  faGithub
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
        if (response === "2fa") {
          this.$router.push("/auth/2fa");
        } else {
          this.$router.push(this.redirect || "/dashboard");
        }
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
  private async oauthLogin(service: string) {
    this.$store.commit("auth/startLoading");
    const link = (await this.$axios.get(`/auth/oauth/${service}`)).data
      .redirect;
    location.replace(link);
  }
}
</script>

<style lang="scss" scoped>
.or {
  text-align: center;
  margin: 1rem 0;
}
.row--type-social {
  flex-wrap: wrap;
}
.social-buttons .button {
  margin-bottom: 0.5rem;
}
</style>
