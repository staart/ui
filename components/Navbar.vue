<template>
  <Trap v-if="isVisible" :disabled="!showNav" class="navbar">
    <div class="container">
      <nuxt-link class="item item--type-logo" to="/">
        <img alt="" src="/android-chrome-72x72.png" />
        <span>Staart</span>
      </nuxt-link>
      <nav v-if="isAuthenticated" :class="{ 'nav--visible-true': showNav }">
        <nuxt-link v-if="user.role === 3" class="item" :to="`/admin/users`"
          >Admin</nuxt-link
        >
        <nuxt-link
          v-if="activeOrganization"
          class="item"
          :to="`/dashboard/${activeOrganization}`"
          >Dashboard</nuxt-link
        >
        <nuxt-link v-else class="item" to="/dashboard">Dashboard</nuxt-link>
        <nuxt-link
          v-if="activeOrganization"
          class="item"
          :to="`/manage/${activeOrganization}/settings`"
          >Settings</nuxt-link
        >
        <nuxt-link v-else class="item" to="/settings">Settings</nuxt-link>
        <nuxt-link class="item" to="/docs">Docs</nuxt-link>
        <span>
          <button
            class="item item--type-less"
            to="/settings/account"
            aria-label="Help"
            data-balloon-pos="down"
            aria-controls="help"
            :aria-expanded="(visible === 'help').toString()"
          >
            <font-awesome-icon
              class="nav-icon hide-mobile"
              icon="question-circle"
              fixed-width
            />
            <span class="hide-desktop">Help</span>
          </button>
          <transition name="dropdown-fade">
            <div
              v-show="visible === 'help'"
              id="help"
              ref="dropdown-help"
              class="dropdown"
            >
              <button class="item" @click="feedback">Feedback</button>
              <nuxt-link class="item" to="/settings/account"
                >Help Center</nuxt-link
              >
              <button class="item" onclick="window.agastya.open()">
                Accessibility
              </button>
            </div>
          </transition>
        </span>
        <span class="hide-mobile">
          <button
            class="item item--type-less item--type-last"
            to="/settings/notifications"
            aria-label="Notifications"
            data-balloon-pos="down"
            aria-controls="notifications"
            :aria-expanded="(visible === 'notifications').toString()"
          >
            <font-awesome-icon class="nav-icon" icon="bell" fixed-width />
            <span v-if="notificationCount" class="notif-count">{{
              notificationCount
            }}</span>
          </button>
          <transition name="dropdown-fade">
            <div
              v-show="visible === 'notifications'"
              id="notifications"
              ref="dropdown-notifications"
              class="dropdown"
              style="width: 350px"
            >
              <Notifications :on-count="updateNotificationCount" />
            </div>
          </transition>
        </span>
        <span>
          <button
            class="item item--type-user"
            aria-controls="account"
            :aria-expanded="(visible === 'account').toString()"
          >
            <img alt="" :src="user.profilePicture" />
            {{ user.nickname }}
          </button>
          <transition name="dropdown-fade">
            <div
              v-show="visible === 'account' && user"
              id="account"
              ref="dropdown-account"
              class="dropdown"
            >
              <nuxt-link
                class="item"
                :to="`/users/${user.username || user.id}/profile`"
                >Profile</nuxt-link
              >
              <div
                v-if="
                  memberships && memberships.data && memberships.data.length
                "
              >
                <div class="subheading">Your teams</div>
                <span
                  v-for="(membership, i) in memberships.data"
                  :key="`m${membership.id}${i}`"
                >
                  <nuxt-link
                    v-if="membership && membership.organization"
                    class="item"
                    :to="
                      `/manage/${membership.organization.username ||
                        membership.organization.id}/settings`
                    "
                    >{{ (membership.organization || {}).name }}</nuxt-link
                  >
                </span>
              </div>
              <nuxt-link
                v-else
                class="item"
                :to="`/users/${user.username || user.id}/memberships`"
                >Your teams</nuxt-link
              >
              <button style="margin-top: 1rem" class="item" @click="logout">
                Logout
              </button>
            </div>
          </transition>
        </span>
      </nav>
      <nav v-else :class="{ 'nav--visible-true': showNav }">
        <nuxt-link class="item" to="/">Solutions</nuxt-link>
        <span>
          <button
            class="item"
            aria-controls="resources"
            :aria-expanded="(visible === 'resources').toString()"
          >
            Resources
          </button>
          <transition name="dropdown-fade">
            <div
              v-show="visible === 'resources'"
              id="resources"
              ref="dropdown-resources"
              class="dropdown"
            >
              <nuxt-link class="item" to="/styleguide">Styleguide</nuxt-link>
              <nuxt-link class="item" to="/policies/licenses"
                >FOSS licenses</nuxt-link
              >
            </div>
          </transition>
        </span>
        <nuxt-link class="item" to="/pricing">Pricing</nuxt-link>
        <nuxt-link class="item" to="/docs">Docs</nuxt-link>
        <nuxt-link
          v-if="$route.path !== '/auth/login'"
          class="button"
          to="/auth/login"
          >Login &rarr;</nuxt-link
        >
        <nuxt-link v-else class="button" to="/auth/register"
          >Get started &rarr;</nuxt-link
        >
      </nav>
    </div>
    <button class="button button--type-nav" @click="showNav = !showNav">
      <font-awesome-icon
        v-if="showNav"
        class="icon nav-icon icon--mr-1"
        icon="times"
        fixed-width
      />
      <font-awesome-icon
        v-else
        class="icon nav-icon icon--mr-1"
        icon="bars"
        fixed-width
      />
      <span v-if="showNav">Hide menu</span>
      <span v-else>Menu</span>
    </button>
  </Trap>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import Trap from "vue-focus-lock";
// import Feeedback from "feeedback";
import {
  faBell,
  faQuestionCircle,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { Memberships } from "../types/settings";
import { emptyPagination } from "../types/manage";
import { emptyUser } from "../types/users";
import Notifications from "@/components/Notifications.vue";
library.add(faBell, faQuestionCircle, faBars, faTimes);
// const feedback = new Feeedback({
//   onSubmit: result =>
//     new Promise((resolve, reject) => {
//       if (window.agastya && typeof window.agastya.secureTrack === "function")
//         window.agastya.secureTrack({ feedback: result });
//       resolve();
//     })
// });

@Component({
  components: {
    FontAwesomeIcon,
    Notifications,
    Trap
  }
})
export default class Card extends Vue {
  visible: string | null = null;
  memberships: Memberships = emptyPagination;
  isVisible = true;
  notificationCount = 0;
  showNav = false;
  activeOrganization: string | null = null;
  loggedInMembership = 3;
  isAuthenticated = false;
  user = emptyUser;
  @Watch("$route")
  private onRouteChanged() {
    this.updateNavBar();
  }
  @Watch("visible")
  private changedVisible() {
    if (this.visible === "account") {
      this.load();
    }
  }
  private updateNavBar() {
    try {
      this.isAuthenticated = this.$store.state.auth.isAuthenticated;
      if (this.isAuthenticated) {
        this.user = this.$store.state.auth.user;
      }
    } catch (error) {}
    this.showNav = false;
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
    if (this.$route.path.startsWith("/onboarding")) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
    if (this.$route.params.team) {
      this.activeOrganization = this.$route.params.team;
    } else {
      this.activeOrganization = this.$store.getters["auth/activeOrganization"];
    }
    const user = this.$store.getters["auth/user"];
    if (user && user.username)
      this.memberships = {
        ...this.$store.getters["users/memberships"](user.username)
      };
  }
  private updateNotificationCount(count: number) {
    this.notificationCount = count;
  }
  private logout() {
    this.$store.dispatch("auth/logout");
    this.isAuthenticated = false;
    this.user = emptyUser;
    this.$router.push("/");
  }
  private mounted() {
    this.updateNavBar();
  }
  private created() {
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
    if (typeof document !== "undefined" && document.body)
      document.body.addEventListener("click", event => {
        const path = event.composedPath();
        this.visible = null;
        document.querySelectorAll("[aria-controls]").forEach(controller => {
          if (path && path.includes(controller)) {
            this.visible = controller.getAttribute("aria-controls");
            setTimeout(() => {
              const container = this.$refs[
                `dropdown-${this.visible}`
              ] as HTMLDivElement;
              if (container) {
                const firstFocus = container.querySelector(
                  "a, button"
                ) as HTMLAnchorElement;
                if (firstFocus) firstFocus.focus();
              }
            }, 1);
          }
        });
      });
  }
  private feedback() {
    // feedback.open();
  }
  private load() {
    const user = this.$store.getters["auth/user"];
    if (
      user &&
      user.username &&
      (!this.memberships ||
        !this.memberships.data ||
        !this.memberships.data.length)
    )
      this.$store
        .dispatch("users/getMemberships", { slug: user.username })
        .then(memberships => {
          this.memberships = { ...memberships };
        })
        .catch(error => {
          throw new Error(error);
        });
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button--type-nav {
  position: absolute;
  top: 0.5rem;
  right: 5vw;
  z-index: 101;
  span {
    transform: translateY(-0.05rem);
    display: inline-block;
  }
}

@media (max-width: 500px) {
  .container {
    padding-top: 1rem;
    nav {
      display: none;
      &.nav--visible-true {
        display: flex !important;
      }
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(0.25rem);
      z-index: 100;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: auto;
      .item {
        display: block;
        width: 100%;
        text-align: center;
        padding: 1rem;
      }
      .button {
        width: auto;
        margin-top: 1rem;
        text-align: center;
      }
    }
  }
}

@media (min-width: 500px) {
  nav .button {
    margin-left: 1.5rem;
  }
  .button--type-nav {
    display: none;
  }
}

.item {
  color: inherit;
  text-decoration: none;
  font: inherit;
  border: none;
  text-align: left;
  background: transparent;
  &:hover {
    opacity: 0.5;
  }
  &.nuxt-link-exact-active {
    font-weight: bold;
  }
}
.item--type-logo {
  text-align: center;
  font-size: 125%;
  &.nuxt-link-exact-active {
    font-weight: normal;
  }
  img {
    height: 1.5rem;
    margin-top: -0.2rem;
    margin-right: 0.25rem;
    vertical-align: middle;
  }
}

nav span {
  position: relative;
  display: inline-block;
}
nav .item {
  padding: 1.5rem;
  display: inline-block;
  img {
    height: 2rem;
    vertical-align: middle;
    margin: -1rem 0.5rem -1rem 0;
    border-radius: 100%;
  }
}

.dropdown {
  z-index: 1000;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  min-width: 175px;
  display: none;
  top: 95%;
  background: #fff;
  box-shadow: 0px 0px 0px 1px rgba(136, 152, 170, 0.1),
    0px 15px 35px 0px rgba(49, 49, 93, 0.1),
    0px 5px 15px 0px rgba(0, 0, 0, 0.08);
  padding: 0.5rem 0;
  border-radius: 0.2rem;
  &::before {
    content: "";
    position: absolute;
    top: -21px;
    left: 50%;
    margin-left: -10px;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSI5IiB2aWV3Qm94PSIwIDAgMjEgOSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjODg5OEFBIiBmaWxsLW9wYWNpdHk9Ii4xIiBkPSJNMSA5LjA5MmgxOWwtNi40MDItNi43NGMtMS43MTctMS44MDYtNC40ODUtMS44LTYuMTk2IDBMMSA5LjA5M3pNMjAuMzQyIDhsLTYuMDItNi4zMzZjLTIuMTA4LTIuMjItNS41MzgtMi4yMTgtNy42NDUgMEwuNjU4IDhoMTkuNjg0eiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik03LjQwMiAyLjM1M2MxLjcxMS0xLjgwMSA0LjQ4LTEuODA3IDYuMTk2IDBMMjAgOS4wOTNIMWw2LjQwMi02Ljc0eiIvPjwvZz48L3N2Zz4=")
      no-repeat;
    background-position: bottom center;
    height: 21px;
    width: 21px;
    z-index: 1;
  }
}
.dropdown {
  display: block;
}
.dropdown .item {
  padding: 0.5rem 1.5rem;
  display: block;
  width: 100%;
}
nav .item.item--type-less {
  padding: 1.5rem 0.5rem;
}
nav .item.item--type-last {
  padding-right: 0;
}
nav .item.item--type-user {
  padding-right: 0.5rem;
}
.organization-name {
  margin-left: 0.5rem;
}
.nav-icon {
  opacity: 0.7;
  transform: scale(1.1);
}
nav .item.item--type-less:hover {
  opacity: 1;
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, margin-top 0.45s;
}
.dropdown-fade-enter,
.dropdown-fade-leave-to {
  opacity: 0;
  margin-top: -0.5rem;
}
.notif-count {
  background-color: #e74c3c;
  display: inline-block;
  color: #fff;
  font-size: 80%;
  font-weight: bold;
  min-width: 1.25rem;
  text-align: center;
  padding: 0 0.25rem;
  border-radius: 100%;
  position: absolute;
  transform: translateX(0.75rem) translateY(-0.75rem) scale(0.8);
}
.subheading {
  display: block;
  padding-left: 1.5rem;
  margin-top: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 85%;
}
</style>
