<template>
  <div :key="`manage_${$route.params.team}`" class="container">
    <aside>
      <nav>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/settings`">
          <font-awesome-icon class="nav-icon" icon="cog" fixed-width />
          <span>Settings</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/members`">
          <font-awesome-icon class="nav-icon" icon="users" fixed-width />
          <span>Team</span>
        </nuxt-link>
        <nuxt-link
          class="item"
          :to="`/manage/${$route.params.team}/subscription`"
        >
          <font-awesome-icon class="nav-icon" icon="box-open" fixed-width />
          <span>Subscription</span>
        </nuxt-link>
        <nuxt-link
          class="item item--type-parent"
          :to="`/manage/${$route.params.team}/billing/details`"
        >
          <font-awesome-icon class="nav-icon" icon="address-card" fixed-width />
          <span>Billing</span>
        </nuxt-link>
        <nav v-if="$route.path.includes('/billing/')" class="sub-nav">
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/billing/details`"
          >
            <span>Customer info</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/billing/sources`"
          >
            <span>Payment methods</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/billing/invoices`"
          >
            <span>Invoices</span>
          </nuxt-link>
        </nav>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/data`">
          <font-awesome-icon class="nav-icon" icon="database" fixed-width />
          <span>Data &amp; security</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/api-keys`">
          <font-awesome-icon class="nav-icon" icon="code" fixed-width />
          <span>Developer APIs</span>
        </nuxt-link>
      </nav>
    </aside>
    <div class="card">
      <slot />
    </div>
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
  faAddressCard,
  faCode
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faDatabase,
  faUsers,
  faCog,
  faBoxOpen,
  faUser,
  faCode,
  faAddressCard
);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Manage extends Vue {
  private mounted() {
    this.update();
  }
  private update() {
    this.$store.commit("auth/setActiveOrganization", this.$route.params.team);
  }
  @Watch("$route.path")
  onRouteChanged() {
    this.update();
  }
}
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
