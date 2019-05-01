<template>
  <div class="navbar">
    <div class="container">
      <nuxt-link class="logo" to="/">Product</nuxt-link>
      <nav v-if="isAuthenticated">
        <nuxt-link to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link to="/page">Analytics</nuxt-link>
        <nuxt-link to="/page">Billing</nuxt-link>
        <nuxt-link to="/page">{{ user.nickname }}</nuxt-link>
      </nav>
      <nav v-else>
        <nuxt-link to="/solutions">Solutions</nuxt-link>
        <nuxt-link to="/resources">Resources</nuxt-link>
        <nuxt-link to="/pricing">Pricing</nuxt-link>
      </nav>
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
export default class Card extends Vue {}
</script>

<style lang="scss" scoped>
.navbar {
  background-color: white;
  border-bottom: 1px solid #ddd;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-weight: bold;
  font-style: italic;
  font-size: 125%;
}
a {
  color: inherit;
  text-decoration: none;
  &:hover {
    opacity: 0.5;
  }
}
nav a {
  margin-left: 3rem;
  padding: 1.5rem 0;
  display: inline-block;
}
</style>
