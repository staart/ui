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
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/billing`">
          <font-awesome-icon class="nav-icon" icon="address-card" fixed-width />
          <span>Billing info</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/sources`">
          <font-awesome-icon class="nav-icon" icon="credit-card" fixed-width />
          <span>Payment methods</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/invoices`">
          <font-awesome-icon class="nav-icon" icon="file-invoice" fixed-width />
          <span>Invoices</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/data`">
          <font-awesome-icon class="nav-icon" icon="database" fixed-width />
          <span>Data &amp; security</span>
        </nuxt-link>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/api-keys`">
          <font-awesome-icon class="nav-icon" icon="code" fixed-width />
          <span>Developer APIs</span>
        </nuxt-link>
        <nuxt-link class="item" to="/settings/account">
          <font-awesome-icon class="nav-icon" icon="user" fixed-width />
          <span>Your account</span>
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
  faDatabase,
  faUsers,
  faCog,
  faCreditCard,
  faFileInvoice,
  faBoxOpen,
  faUser,
  faAddressCard,
  faCode
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faDatabase,
  faUsers,
  faCog,
  faCreditCard,
  faFileInvoice,
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
export default class Manage extends Vue {}
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
  &.nuxt-link-active {
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
