<template>
  <b-navbar
    wrapper-class="container"
    :transparent="true"
    :type="type"
    style="padding: 0.5rem 0"
    v-show="!$route.path.startsWith('/onboarding/')"
  >
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="https://raw.githubusercontent.com/staart/api/master/assets/logo.png"
          alt="Staart"
        />
      </b-navbar-item>
    </template>
    <template
      v-if="
        isAuthenticated && userMemberships && $route.path.startsWith('/teams/')
      "
      slot="start"
    >
      <b-navbar-dropdown label="Organization name" hoverable boxed>
        <b-navbar-item
          v-for="(membership, i) in userMemberships"
          :key="`m${i}${membership.id}`"
          href="#"
          >{{ membership.organization.name }}</b-navbar-item
        >
        <b-navbar-item class="has-text-weight-bold">
          <nuxt-link :to="`/users/${user.details.username}/teams`"
            >Create a new team</nuxt-link
          >
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template v-else slot="start">
      <b-navbar-item href="#">Features</b-navbar-item>
      <b-navbar-item href="#">Use Cases</b-navbar-item>
      <b-navbar-item href="#">Pricing</b-navbar-item>
      <b-navbar-dropdown label="Resources" hoverable boxed>
        <b-navbar-item href="#">Documentation</b-navbar-item>
        <b-navbar-item href="#">Accessibility</b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template slot="end" v-if="isAuthenticated && user.details.username">
      <b-navbar-dropdown
        :label="user.details.name"
        :right="true"
        hoverable
        boxed
      >
        <b-navbar-item>
          <nuxt-link :to="`/users/${user.details.username}/profile`"
            >Account settings</nuxt-link
          >
        </b-navbar-item>
        <b-navbar-item>
          <b-button @click="logout" type="is-light">Logout</b-button>
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template slot="end" v-else>
      <b-navbar-item tag="div">
        <div class="buttons">
          <nuxt-link to="/auth/register" class="button is-primary">
            <strong>Get started for free</strong>
          </nuxt-link>
          <nuxt-link to="/auth/login" class="button is-light">Login</nuxt-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { User } from "../../store/auth";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user"
  })
})
export default class Navbar extends Vue {
  isAuthenticated!: boolean;
  user!: User;
  @Prop({ default: "is-light" }) readonly type!: string;

  get userMemberships() {
    return this.user.memberships?.data;
  }

  async logout() {
    return this.$store.dispatch("auth/logout");
  }
}
</script>
