<template>
  <b-navbar wrapper-class="container" :transparent="true" style="padding: 0.5rem 0">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="https://raw.githubusercontent.com/staart/api/master/assets/logo.png" alt="Staart" />
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item href="#">Features</b-navbar-item>
      <b-navbar-item href="#">Use Cases</b-navbar-item>
      <b-navbar-item href="#">Pricing</b-navbar-item>
      <b-navbar-dropdown label="Resources" hoverable boxed>
        <b-navbar-item href="#">Documentation</b-navbar-item>
        <b-navbar-item href="#">Accessibility</b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template slot="end" v-if="isAuthenticated && user.details.username">
      <b-navbar-dropdown :label="user.details.name" :right="true" hoverable boxed>
        <b-navbar-item>
          <nuxt-link :to="`/users/${user.details.username}`">Account settings</nuxt-link>
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
import Vue from "vue";
import { mapGetters } from "vuex";
import Component from "vue-class-component";
import { User } from "../../store/auth";

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user"
  })
})
export default class Navbar extends Vue {
  isAuthenticated!: boolean;
  user!: User;

  async logout() {
    return this.$store.dispatch("auth/logout");
  }
}
</script>
