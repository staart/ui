<template>
  <div class="navbar">
    <div class="container">
      <nuxt-link class="item item--type-logo" to="/">Product</nuxt-link>
      <nav v-if="isAuthenticated">
        <nuxt-link class="item" to="/dashboard">Dashboard</nuxt-link>
        <span>
          <nuxt-link class="item" to="/settings/account">{{
            user.name
          }}</nuxt-link>
          <div class="dropdown">
            <nuxt-link class="item" to="/settings/account">Settings</nuxt-link>
            <nuxt-link class="item" to="/settings/organizations"
              >Organizations</nuxt-link
            >
            <button class="item" @click="logout">Logout</button>
          </div>
        </span>
      </nav>
      <nav v-else>
        <nuxt-link class="item" to="/">Solutions</nuxt-link>
        <span>
          <nuxt-link class="item" to="/">Resources</nuxt-link>
          <div class="dropdown">
            <nuxt-link class="item" to="/">Blog</nuxt-link>
            <nuxt-link class="item" to="/">Help Center</nuxt-link>
            <nuxt-link class="item" to="/">Developer API</nuxt-link>
          </div>
        </span>
        <nuxt-link class="item" to="/">Pricing</nuxt-link>
        <nuxt-link class="button button--color-primary" to="/auth/login"
          >Login &rarr;</nuxt-link
        >
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
export default class Card extends Vue {
  private logout() {
    this.$store.dispatch("auth/logout");
    this.$router.push("/");
  }
}
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

.item {
  color: inherit;
  text-decoration: none;
  font: inherit;
  border: none;
  text-align: left;
  background: transparent;
  &:hover {
    opacity: 0.5;
  }
}
.item--type-logo {
  font-weight: bold;
  font-style: italic;
  font-size: 125%;
}

nav span {
  position: relative;
  display: inline-block;
}
nav .item {
  padding: 1.5rem;
  display: inline-block;
}
nav .button {
  margin-left: 1.5rem;
}

.dropdown {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  min-width: 175px;
  display: none;
  background: #fff;
  border: 1px solid #ddd;
  border-top: 1px solid #fff;
  padding: 0 0 0.5rem 0;
}
nav span:hover .dropdown,
nav .item:focus + .dropdown {
  display: block;
}
.dropdown .item {
  padding: 0.5rem 1.5rem;
  display: block;
  width: 100%;
}
</style>
