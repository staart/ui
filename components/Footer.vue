<template>
  <div v-if="isVisible" class="footer">
    <div v-if="!isAuthenticated" class="banner">
      <div class="hero hero--align-center">
        <h1>It's a no-brainer&mdash;get started now.</h1>
        <p>Create an account in our fake startup to see Staart in action.</p>
        <div>
          <nuxt-link
            class="button button--size-large button--color-primary"
            to="/auth/register"
            >Get started for free &rarr;</nuxt-link
          >
        </div>
      </div>
    </div>
    <div class="container links">
      <div class="larger">
        <nuxt-link class="logo" to="/">Staart</nuxt-link>
        <p>
          <a target="_blank" href="https://o15y.com">An O15Y project</a>
        </p>
        <p>
          <a target="_blank" href="https://anandchowdhary.com"
            >Made by Anand Chowdhary</a
          >
        </p>
      </div>
      <div>
        <h2>Product</h2>
        <nav>
          <nuxt-link to="/">Why Staart?</nuxt-link>
          <nuxt-link to="/">Enterprise</nuxt-link>
          <nuxt-link to="/">Security &amp; privacy</nuxt-link>
          <nuxt-link to="/pricing">Pricing</nuxt-link>
          <nuxt-link to="/">Staart Demo</nuxt-link>
        </nav>
      </div>
      <div>
        <h2>Use cases</h2>
        <nav>
          <nuxt-link to="/">Set up appointments</nuxt-link>
          <nuxt-link to="/">Automated emails</nuxt-link>
          <nuxt-link to="/">Personal assistant</nuxt-link>
          <nuxt-link to="/">Calendar automation</nuxt-link>
          <nuxt-link to="/">AI for business</nuxt-link>
        </nav>
      </div>
      <div>
        <h2>Resources</h2>
        <nav>
          <nuxt-link to="/">Blog</nuxt-link>
          <nuxt-link to="/">Developer API</nuxt-link>
          <nuxt-link to="/">Help Center</nuxt-link>
          <nuxt-link to="/">Partners</nuxt-link>
          <button onclick="window.agastya.open()">Accessibility</button>
        </nav>
      </div>
      <div>
        <h2>Policies</h2>
        <nav>
          <nuxt-link to="/">Terms of use</nuxt-link>
          <nuxt-link to="/policies/privacy/">Privacy</nuxt-link>
          <nuxt-link to="/">Cookies</nuxt-link>
          <nuxt-link to="/">GDPR</nuxt-link>
        </nav>
      </div>
      <div>
        <h2>Company</h2>
        <nav>
          <nuxt-link to="/">About us</nuxt-link>
          <nuxt-link to="/">O15Y</nuxt-link>
          <nuxt-link to="/">News</nuxt-link>
          <nuxt-link to="/">Presskit</nuxt-link>
          <nuxt-link to="/">Careers</nuxt-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user"
  })
})
export default class Footer extends Vue {
  isVisible = true;
  @Watch("$route")
  private onRouteChanged() {
    this.updateNavBar();
  }
  private updateNavBar() {
    if (this.$route.path.startsWith("/onboarding")) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }
  private mounted() {
    this.updateNavBar();
  }
}
</script>

<style lang="scss" scoped>
.footer {
  padding-bottom: 4rem;
  font-size: 90%;
}
.logo {
  font-weight: bold;
  font-style: italic;
  font-size: 110%;
  color: inherit;
  text-decoration: none;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: top;
  .larger {
    width: 25%;
  }
  > div {
    flex-grow: 1;
  }
}
h2 {
  font-size: 110%;
  margin-bottom: 0.5rem;
}
nav {
  a,
  button {
    display: block;
    color: inherit;
    text-decoration: none;
    padding: 0.25rem 0;
    &:hover {
      text-decoration: underline;
    }
  }
  button {
    background: none;
    font: inherit;
    border: none;
  }
}
.banner {
  text-align: center;
  background-color: #fff;
  padding: 1rem 0;
}
.hero p {
  font-size: 110%;
}
.links {
  padding-top: 4rem;
}
</style>
