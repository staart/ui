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
          class="item item--type-parent"
          :to="`/manage/${$route.params.team}/team/members`"
        >
          <font-awesome-icon class="nav-icon" icon="users" fixed-width />
          <span>Team</span>
        </nuxt-link>
        <nav v-if="$route.path.includes('/team/')" class="sub-nav">
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/team/members`"
          >
            <span>Members</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/team/settings`"
          >
            <span>Settings</span>
          </nuxt-link>
        </nav>
        <nuxt-link
          class="item item--type-parent"
          :to="`/manage/${$route.params.team}/billing/details`"
        >
          <font-awesome-icon
            class="nav-icon"
            icon="money-bill-wave"
            fixed-width
          />
          <span>Billing</span>
        </nuxt-link>
        <nav v-if="$route.path.includes('/billing/')" class="sub-nav">
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/billing/details`"
          >
            <span>Details</span>
          </nuxt-link>
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/billing/subscription`"
          >
            <span>Subscription</span>
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
          <nuxt-link
            class="sub-item"
            :to="`/manage/${$route.params.team}/developer/logs`"
          >
            <span>API logs</span>
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
  loggedInMembership = 3;
  doneOnce = false;
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
