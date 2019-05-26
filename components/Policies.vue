<template>
  <div class="container">
    <aside>
      <div class="nav-heading">Policies</div>
      <nav>
        <nuxt-link class="item" to="/policies/privacy">
          <font-awesome-icon class="nav-icon" icon="lock" fixed-width />
          <span>Privacy Policy</span>
        </nuxt-link>
        <nuxt-link class="item" to="/policies/terms">
          <font-awesome-icon class="nav-icon" icon="user" fixed-width />
          <span>Terms of Use</span>
        </nuxt-link>
        <nuxt-link class="item" to="/policies/cookies">
          <font-awesome-icon class="nav-icon" icon="cookie-bite" fixed-width />
          <span>Cookie Policy</span>
        </nuxt-link>
        <nuxt-link class="item" to="/policies/sla">
          <font-awesome-icon class="nav-icon" icon="building" fixed-width />
          <span>Enterprise SLA</span>
        </nuxt-link>
        <nuxt-link class="item" to="/policies/licenses">
          <font-awesome-icon
            class="nav-icon"
            :icon="['fab', 'git-alt']"
            fixed-width
          />
          <span>FOSS Licenses</span>
        </nuxt-link>
      </nav>
    </aside>
    <div class="card">
      <div class="inside">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faCookieBite,
  faBuilding,
  faLock
} from "@fortawesome/free-solid-svg-icons";
import { faGitAlt } from "@fortawesome/free-brands-svg-icons";
library.add(faUser, faCookieBite, faBuilding, faGitAlt, faLock);

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
aside nav {
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
.inside {
  max-width: 720px;
  margin: 2rem auto;
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
  &.nuxt-link-exact-active {
    font-weight: bold;
    padding-left: 1rem;
    margin-left: -1rem;
    color: #492257;
    background-color: #fff;
    border-radius: 0.2rem 0 0 0.2rem;
    box-shadow: -7px 10px 10px rgba(60, 66, 87, 0.075), 2px 0 0 #fff;
    &:hover {
      opacity: 1;
    }
    .nav-icon {
      opacity: 0.75;
    }
  }
}
</style>
