<template>
  <b-navbar
    wrapper-class="container"
    :transparent="true"
    type="is-dark"
    class="nav"
    v-show="!$route.path.startsWith('/onboarding/')"
  >
    <template slot="brand">
      <b-navbar-item tag="router-link" class="logo" :to="{ path: '/' }">
        <img
          src="https://raw.githubusercontent.com/staart/staart.js.org/master/assets/icon-white.svg"
          alt
        />
        <span>Staart</span>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-dropdown
        v-if="userMemberships && $route.path.startsWith('/teams/')"
        :label="teamsLabel"
        hoverable
        boxed
      >
        <b-navbar-item
          v-for="(membership, i) in userMemberships"
          tag="nuxt-link"
          :key="`m${i}${membership.id}`"
          :to="$route.path.replace($route.params.id, membership.groupId)"
        >{{ membership.group.name }}</b-navbar-item>
        <b-navbar-item
          class="has-text-weight-bold"
          tag="nuxt-link"
          :to="`/users/${user.details.id}/teams`"
        >Create a new team</b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item v-else-if="isAuthenticated" tag="nuxt-link" to="/">Dashboard</b-navbar-item>
      <b-navbar-item tag="nuxt-link" to="/admin" v-if="user.details.role === 'SUDO'">Admin</b-navbar-item>
    </template>
    <template slot="end" v-if="user.details.id">
      <b-navbar-dropdown :right="true" hoverable boxed>
        <template slot="label">
          <figure class="image">
            <img class="is-rounded" :src="user.details.profilePictureUrl" />
          </figure>
          <span>{{ (user.details.name || "").split(" ")[0] }}</span>
        </template>
        <b-navbar-item tag="nuxt-link" :to="`/users/${user.details.id}/profile`">Account settings</b-navbar-item>
        <b-navbar-item role="button" @click="logout">Logout</b-navbar-item>
      </b-navbar-dropdown>
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
    user: "auth/user",
  }),
})
export default class Navbar extends Vue {
  isAuthenticated!: boolean;
  user!: User;

  get userMemberships() {
    return this.user.memberships?.data || [];
  }

  get teamsLabel() {
    const team = this.userMemberships.find(
      (i: any) => i.groupId === this.$route.params.id
    );
    if (team) return team.group.name;
    return "Change team";
  }

  async logout() {
    this.$router.push("/");
  }
}
</script>

<style scoped>
.image img {
  margin-right: 1.5rem;
  width: 1.5rem;
  transform: scale(1.5);
}
</style>

<style>
.is-light {
  background: none;
}
.container {
  max-width: 1000px;
}
.navbar.is-dark.nav {
  position: relative;
  padding: 0.5rem 0;
  z-index: 100;
}
.logo {
  margin-right: 1rem;
}
.logo img {
  margin-right: 0.75rem;
}
.logo span {
  font-size: 107%;
}
</style>
