<template>
  <div class="container">
    <aside>
      <nav>
        <nuxt-link class="item" to="/settings/account">
          <font-awesome-icon class="nav-icon" icon="user" fixed-width />
          <span>Account</span>
        </nuxt-link>
        <nuxt-link class="item" to="/settings/emails">
          <font-awesome-icon class="nav-icon" icon="envelope" fixed-width />
          <span>Emails</span>
        </nuxt-link>
        <nuxt-link class="item" to="/settings/security">
          <font-awesome-icon class="nav-icon" icon="key" fixed-width />
          <span>Password &amp; security</span>
        </nuxt-link>
        <nuxt-link class="item" to="/settings/organizations">
          <font-awesome-icon class="nav-icon" icon="building" fixed-width />
          <span>Organizations</span>
        </nuxt-link>
        <nuxt-link class="item" to="/settings/data">
          <font-awesome-icon class="nav-icon" icon="database" fixed-width />
          <span>Data &amp; privacy</span>
        </nuxt-link>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEnvelope,
  faKey,
  faDatabase,
  faBuilding,
  faUser
} from "@fortawesome/free-solid-svg-icons";
library.add(faEnvelope, faKey, faDatabase, faBuilding, faUser);

@Component({
  components: {
    FontAwesomeIcon
  }
})
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
.nav-icon {
  margin-right: 0.5rem;
  opacity: 0.3;
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
    .nav-icon {
      opacity: 0.75;
    }
  }
}
</style>
