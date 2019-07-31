<template>
  <div
    :key="`manage_${$route.params.team}`"
    class="container container--type-settings"
  >
    <aside>
      <nav>
        <nuxt-link class="item" :to="`/manage/${$route.params.team}/settings`">
          <font-awesome-icon class="nav-icon" icon="cog" fixed-width />
          <span>Settings</span>
        </nuxt-link>
        <nuxt-link
          v-if="loggedInMembership !== 4"
          class="item"
          :to="`/manage/${$route.params.team}/members`"
        >
          <font-awesome-icon class="nav-icon" icon="users" fixed-width />
          <span>Team</span>
        </nuxt-link>
        <nuxt-link
          v-if="loggedInMembership !== 3 && loggedInMembership !== 4"
          class="item"
          :to="`/manage/${$route.params.team}/subscription`"
        >
          <font-awesome-icon class="nav-icon" icon="box-open" fixed-width />
          <span>Subscription</span>
        </nuxt-link>
        <nuxt-link
          v-if="loggedInMembership !== 3 && loggedInMembership !== 4"
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
        <nuxt-link
          class="item item--type-parent"
          :to="`/manage/${$route.params.team}/developer/api-keys`"
        >
          <font-awesome-icon class="nav-icon" icon="code" fixed-width />
          <span>Developer</span>
        </nuxt-link>
        <nav v-if="$route.path.includes('/developer/')" class="sub-nav">
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/developer/api-keys`"
          >
            <span>API keys</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/developer/webhooks`"
          >
            <span>Webhooks</span>
          </nuxt-link>
        </nav>
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
  loggedInMembership = 3;
  private created() {
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }
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
