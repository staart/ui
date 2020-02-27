<template>
  <div :key="`manage_${$route.params.team}`">
    <div class="subnav">
      <div class="container">
        <nav>
          <nuxt-link :to="`/teams/${$route.params.team}/products`">
            Products
          </nuxt-link>
          <nuxt-link :to="`/teams/${$route.params.team}/members`">
            Members
          </nuxt-link>
          <nuxt-link :to="`/teams/${$route.params.team}/billing/details`">
            Billing
          </nuxt-link>
          <nuxt-link :to="`/teams/${$route.params.team}/developer/api-keys`">
            Developer
          </nuxt-link>
          <nuxt-link :to="`/teams/${$route.params.team}/settings/general`">
            Team settings
          </nuxt-link>
        </nav>
      </div>
    </div>
    <slot />
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
  faMoneyBillWave,
  faCode
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faDatabase,
  faUsers,
  faCog,
  faBoxOpen,
  faUser,
  faCode,
  faMoneyBillWave
);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Manage extends Vue {
  doneOnce = false;
  private created() {}
  private mounted() {
    this.update();
  }

  private update() {
    this.$store.commit("auth/setActiveOrganization", this.$route.params.team);
    this.getUserMembership();
  }

  private getUserMembership() {
    const user = this.$store.state.auth.user;
    if (user) {
      const org = this.$store.state.auth.activeOrganization;
      if (org) {
        const memberships = this.$store.state.users.memberships[
          user.username || user.id
        ];
        if (memberships) {
          const yourMembership = memberships.data.filter(
            membership =>
              membership.organization.id === org ||
              membership.organization.username === org
          );
          if (yourMembership.length) {
            const role = yourMembership[0].role;
            this.$store.commit("manage/setLoggedInMembership", {
              team: org,
              role
            });
          } else if (!this.doneOnce) {
            this.$store
              .dispatch("users/getMemberships", { slug: user.username })
              .then(() => this.getUserMembership())
              .catch(() => {})
              .then(() => (this.doneOnce = true));
          }
        } else {
          this.$store
            .dispatch("users/getMemberships", { slug: user.username })
            .then(() => this.getUserMembership())
            .catch(() => {});
        }
      }
    }
  }

  @Watch("$route.path")
  onRouteChanged() {
    this.update();
  }
}
</script>
