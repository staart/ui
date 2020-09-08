<template>
  <b-navbar
    wrapper-class="container"
    :transparent="true"
    type="is-dark"
    class="nav-2"
    v-show="$route.path.startsWith('/teams/')"
  >
    <template slot="start">
      <b-navbar-item tag="nuxt-link" :to="`/teams/${$route.params.id}`">Dashboard</b-navbar-item>
      <b-navbar-item tag="nuxt-link" :to="`/teams/${$route.params.id}/settings`">Settings</b-navbar-item>
      <b-navbar-item tag="nuxt-link" :to="`/teams/${$route.params.id}/members`">Team</b-navbar-item>
      <b-navbar-item tag="nuxt-link" :to="`/teams/${$route.params.id}/billing`">Billing</b-navbar-item>
      <b-navbar-item tag="nuxt-link" :to="`/teams/${$route.params.id}/developers`">Developers</b-navbar-item>
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
.nav-2 {
  background: none;
  margin-top: -1rem;
}
.nav-2 .navbar-item + .navbar-item {
  margin-left: 0.5rem;
}
.nav-2 .nuxt-link-exact-active {
  font-weight: bold;
}
</style>
