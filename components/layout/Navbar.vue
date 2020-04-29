<template>
  <b-navbar
    v-if="isAuthenticated"
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
      v-if="userMemberships && $route.path.startsWith('/teams/')"
      slot="start"
    >
      <b-navbar-dropdown :label="teamsLabel" hoverable boxed>
        <b-navbar-item
          v-for="(membership, i) in userMemberships"
          :key="`m${i}${membership.id}`"
          href="#"
        >
          {{ membership.organization.name }}
        </b-navbar-item>
        <b-navbar-item class="has-text-weight-bold">
          <nuxt-link :to="`/users/${user.details.username}/teams`">
            Create a new team
          </nuxt-link>
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
    <template slot="end" v-if="user.details.username">
      <b-navbar-dropdown
        :label="user.details.nickname"
        :right="true"
        hoverable
        boxed
      >
        <b-navbar-item>
          <nuxt-link :to="`/users/${user.details.username}/profile`">
            Account settings
          </nuxt-link>
        </b-navbar-item>
        <b-navbar-item
          tag="button"
          class="button is-white is-fullwidth has-text-left"
          @click="logout"
        >
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
  @Prop({ default: "is-light" }) readonly type!: string;

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
.is-light {
  background: none;
}
</style>
