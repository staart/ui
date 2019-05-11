<template>
  <div class="container">
    <aside>
      <nav>
        <nuxt-link class="item" to="/settings/account">Account</nuxt-link>
        <nuxt-link class="item" to="/settings/emails">Emails</nuxt-link>
        <nuxt-link class="item" to="/settings/security"
          >Password &amp; security</nuxt-link
        >
        <nuxt-link class="item" to="/settings/data"
          >Data &amp; privacy</nuxt-link
        >
        <nuxt-link class="item" to="/settings/organizations"
          >Organizations</nuxt-link
        >
      </nav>
    </aside>
    <main class="card">
      <slot />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component
export default class Settings extends Vue {}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
}
aside {
  width: 250px;
}
aside nav {
  position: sticky;
  top: 1rem;
}
main {
  flex-grow: 1;
  padding: 2rem;
}
.nav-heading {
  font-weight: bold;
  margin: 1rem 0;
  font-size: 110%;
}
.item {
  display: block;
  text-decoration: none;
  padding: 0.7rem 0;
  color: inherit;
  &.nuxt-link-exact-active {
    font-weight: bold;
    padding-left: 1rem;
    margin-left: -1rem;
    color: #492257;
    background-color: #fff;
    border-radius: 0.2rem 0 0 0.2rem;
    box-shadow: -7px 10px 10px rgba(60, 66, 87, 0.075), 2px 0 0 #fff;
  }
}
</style>
