<template>
  <div :key="`manage_${$route.params.slug}`">
    <div class="subnav">
      <div class="container">
        <nav>
          <nuxt-link :to="`/users/${$route.params.slug}/account/profile`">
            Settings
          </nuxt-link>
          <nuxt-link :to="`/users/${$route.params.slug}/teams`">
            Teams
          </nuxt-link>
          <nuxt-link
            :to="`/users/${$route.params.slug}/developer/access-tokens`"
          >
            Developer
          </nuxt-link>
        </nav>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faDatabase,
  faUsers,
  faCog,
  faBoxOpen,
  faUser,
  faMoneyBillWave,
  faCode
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faDatabase,
  faUsers,
  faCog,
  faBoxOpen,
  faUser,
  faCode,
  faMoneyBillWave
);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class UsersLayout extends Vue {}
</script>
