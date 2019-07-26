<template>
  <div
    :key="`users_${$route.params.slug}`"
    class="container container--type-settings"
  >
    <aside>
      <nav>
        <nuxt-link class="item" :to="`/users/${$route.params.slug}/profile`">
          <font-awesome-icon class="nav-icon" icon="user" fixed-width />
          <span>Profile</span>
        </nuxt-link>
        <nuxt-link
          class="item item--type-parent"
          :to="`/users/${$route.params.slug}/login/emails`"
        >
          <font-awesome-icon class="nav-icon" icon="key" fixed-width />
          <span>Login</span>
        </nuxt-link>
        <nav v-if="$route.path.includes('/login/')" class="sub-nav">
          <nuxt-link
            class="sub-item"
            :to="`/users/${$route.params.slug}/login/emails`"
          >
            <span>Emails</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/users/${$route.params.slug}/login/passwords`"
          >
            <span>Passwords &amp; 2FA</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/users/${$route.params.slug}/login/sessions`"
          >
            <span>Sessions</span>
          </nuxt-link>
        </nav>
        <nuxt-link
          class="item"
          :to="`/users/${$route.params.slug}/memberships`"
        >
          <font-awesome-icon class="nav-icon" icon="building" fixed-width />
          <span>Your teams</span>
        </nuxt-link>
        <nuxt-link
          class="item"
          :to="`/users/${$route.params.slug}/access-tokens`"
        >
          <font-awesome-icon class="nav-icon" icon="code" fixed-width />
          <span>Access tokens</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/users/${$route.params.slug}/data`">
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
  faKey,
  faDatabase,
  faBuilding,
  faUser,
  faCode
} from "@fortawesome/free-solid-svg-icons";
library.add(faKey, faDatabase, faBuilding, faUser, faCode);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Settings extends Vue {}
</script>
