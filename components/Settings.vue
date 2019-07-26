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
          <span>Your teams</span>
        </nuxt-link>
        <nuxt-link class="item" to="/settings/data">
          <font-awesome-icon class="nav-icon" icon="database" fixed-width />
          <span>Data &amp; privacy</span>
        </nuxt-link>
      </nav>
    </aside>
    <div class="card">
      <slot />
    </div>
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
  width: 300px;
}
aside > nav {
  position: sticky;
  top: 1rem;
}
.card {
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
  transition: 0.3s;
}
.item {
  transition: 0.3s;
  display: block;
  text-decoration: none;
  padding: 0.7rem 0;
  color: inherit;
  &:hover {
    .nav-icon {
      opacity: 0.75;
    }
  }
  &.nuxt-link-active:not(.item--type-parent) {
    font-weight: bold;
  }
}
.sub-nav {
  margin-top: -0.5rem;
  border-left: 0.1rem solid rgba(0, 0, 0, 0.1);
  padding-left: 1.4rem;
  margin-left: 0.5rem;
}
.sub-item {
  display: block;
  color: inherit;
  margin: 0.5rem 0;
  &.nuxt-link-active {
    font-weight: bold;
  }
}
</style>
