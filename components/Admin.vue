<template>
  <div class="container container--type-settings">
    <aside>
      <nav>
        <nuxt-link class="item" :to="`/admin/users`">
          <font-awesome-icon class="nav-icon" icon="users" fixed-width />
          <span>Users</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/admin/teams`">
          <font-awesome-icon class="nav-icon" icon="building" fixed-width />
          <span>Teams</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/admin/server-logs`">
          <font-awesome-icon class="nav-icon" icon="code" fixed-width />
          <span>Server logs</span>
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
import { faUsers, faBuilding, faCode } from "@fortawesome/free-solid-svg-icons";
library.add(faUsers, faBuilding, faCode);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Settings extends Vue {}
</script>
