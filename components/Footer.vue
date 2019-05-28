<template>
  <div class="footer">
    <div v-if="!isAuthenticated" class="banner">
      <div class="hero hero--align-center">
        <h1>It's a no-brainer&mdash;get started now.</h1>
        <div>
          <nuxt-link
            class="button button--size-large button--color-primary"
            to="/auth/register"
            >Get started for free &rarr;</nuxt-link
          >
        </div>
      </div>
    </div>
    <div class="container">
      <div class="larger">
        <nuxt-link class="logo" to="/">Staart</nuxt-link>
        <p>An O15Y company</p>
      </div>
      <div>
        <h2>Product</h2>
        <nav>
          <nuxt-link to="/">Why Staart?</nuxt-link>
          <nuxt-link to="/">Enterprise</nuxt-link>
          <nuxt-link to="/">Security &amp; privacy</nuxt-link>
          <nuxt-link to="/">Pricing</nuxt-link>
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
          <nuxt-link to="/policies/privacy">Terms &amp; privacy</nuxt-link>
          <nuxt-link to="/">Partners</nuxt-link>
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
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user"
  })
})
export default class Footer extends Vue {}
</script>

<style lang="scss" scoped>
.footer {
  padding: 4rem 0;
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
nav a {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 0.25rem 0;
}
.banner {
  text-align: center;
  background-color: #fff;
  padding: 1rem 0;
  margin-bottom: 4rem;
}
</style>
