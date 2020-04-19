<template>
  <b-navbar wrapper-class="container" :transparent="true">
    {{ user }}
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img alt src="/android-chrome-72x72.png" />
        <span>StartupName</span>
      </b-navbar-item>
    </template>
    <template v-if="isAuthenticated" slot="start">
      <b-navbar-item>
        <b-dropdown aria-role="list">
          <button
            slot="trigger"
            slot-scope="{ activeTeamList }"
            class="button is-text"
          >
            <span>Team name</span>
            <b-icon :icon="activeTeamList ? 'menu-up' : 'menu-down'"></b-icon>
          </button>

          <b-dropdown-item aria-role="listitem">Action</b-dropdown-item>
          <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
          <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
        </b-dropdown>
      </b-navbar-item>
    </template>
    <template v-else slot="start">
      <b-navbar-item href="#">Features</b-navbar-item>
      <b-navbar-item href="#">Use cases</b-navbar-item>
      <b-navbar-item href="#">Pricing</b-navbar-item>
      <b-navbar-dropdown label="Resources" :hoverable="true" :boxed="true">
        <b-navbar-item href="#">Documentation</b-navbar-item>
        <b-navbar-item href="#">Helpdesk</b-navbar-item>
        <b-navbar-item href="#">Changelog</b-navbar-item>
        <b-navbar-item href="#">Blog</b-navbar-item>
        <b-navbar-item href="#">About</b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template slot="end">
      <b-navbar-item v-if="!isAuthenticated" tag="div">
        <div class="buttons">
          <router-link to="/auth/register" class="button is-primary"
            >Get started</router-link
          >
          <router-link to="/auth/login" class="button is-light"
            >Login</router-link
          >
        </div>
      </b-navbar-item>
      <b-navbar-item v-else tag="div">
        <b-navbar-dropdown
          label="User name"
          :hoverable="true"
          :boxed="true"
          :right="true"
        >
          <b-navbar-item href="#">Account settings</b-navbar-item>
          <b-navbar-item href="#">Logout</b-navbar-item>
        </b-navbar-dropdown>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { User } from "../types/users";

@Component({
  computed: {
    ...mapGetters({
      user: "users/user",
    }),
  },
})
export default class Navbar extends Vue {
  isAuthenticated = false;
  user?: User;
}
</script>
