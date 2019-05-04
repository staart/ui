<template>
  <div class="container">
    <aside>
      <div class="nav-heading">Settings</div>
      <nav>
        <nuxt-link class="item" to="/settings/account">Account</nuxt-link>
        <nuxt-link class="item" to="/settings/emails">Emails</nuxt-link>
        <nuxt-link class="item" to="/settings/privacy">Privacy</nuxt-link>
        <nuxt-link class="item" to="/settings/organizations"
          >Organizations</nuxt-link
        >
      </nav>
    </aside>
    <main>
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
main {
  flex-grow: 1;
  padding: 2rem;
  background-color: #fff;
}
.nav-heading {
  font-weight: bold;
  margin: 1rem 0;
  font-size: 110%;
}
.item {
  display: block;
  text-decoration: none;
  padding: 0.75rem 1rem;
  color: inherit;
  &.nuxt-link-exact-active {
    background-color: #fff;
  }
}
h1 {
  margin: 0 0 2rem 0;
  font-size: 150%;
}
</style>
