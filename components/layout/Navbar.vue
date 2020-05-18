<template>
  <b-navbar
    wrapper-class="container"
    :transparent="true"
    type="is-white"
    style="box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1); padding: 0.5rem 0; position: relative; z-index: 100"
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
          :to="
            $route.path.replace(
              $route.params.username,
              membership.organization.username
            )
          "
        >
          {{ membership.organization.name }}
        </b-navbar-item>
        <b-navbar-item
          class="has-text-weight-bold"
          tag="nuxt-link"
          :to="`/users/${user.details.username}/teams`"
        >
          Create a new team
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item v-else-if="isAuthenticated" tag="nuxt-link" to="/">
        Dashboard
      </b-navbar-item>
      <b-navbar-item
        tag="nuxt-link"
        to="/admin"
        v-if="user.details.role === 'SUDO'"
      >
        Admin
      </b-navbar-item>
    </template>
    <template slot="end" v-if="user.details.username">
      <b-navbar-dropdown :right="true" hoverable boxed>
        <template slot="label">
          <figure class="image">
            <img class="is-rounded" :src="user.details.profilePicture" />
          </figure>
          <span>{{ user.details.nickname }}</span>
        </template>
        <b-navbar-item
          tag="nuxt-link"
          :to="`/users/${user.details.username}/profile`"
        >
          Account settings
        </b-navbar-item>
        <b-navbar-item role="button" @click="logout">
          Logout
        </b-navbar-item>
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
      (i: any) => i.organization.username === this.$route.params.username
    );
    if (team) return team.organization.name;
    return "Change team";
  }

  async logout() {
    await this.$store.dispatch("auth/logout");
    this.$router.push("/");
  }
}
</script>

<style scoped>
.image img {
  margin-right: 1rem;
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
</style>
