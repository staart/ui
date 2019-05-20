<template>
  <div class="navbar">
    <div class="container">
      <nuxt-link class="item" to="/">
        <span class="item--type-logo">Product</span>
        <span v-if="organization" class="organization-name">
          {{ organization.organization.name }}
        </span>
      </nuxt-link>
      <nav v-if="isAuthenticated">
        <nuxt-link class="item" to="/dashboard">Dashboard</nuxt-link>
        <span>
          <nuxt-link class="item" to="/settings/account">
            Notifications
          </nuxt-link>
          <div class="dropdown" style="width: 350px">
            <Notifications />
          </div>
        </span>
        <nuxt-link class="item" to="/manage/settings">Settings</nuxt-link>
        <span>
          <nuxt-link class="item item--type-user" to="/settings/account">
            <img alt="" :src="user.profilePicture" />
            {{ user.nickname }}
          </nuxt-link>
          <div class="dropdown">
            <nuxt-link class="item" to="/settings/account">Settings</nuxt-link>
            <nuxt-link class="item" to="/settings/organizations"
              >Organizations</nuxt-link
            >
            <button class="item" @click="logout">Logout</button>
          </div>
        </span>
      </nav>
      <nav v-else>
        <nuxt-link class="item" to="/">Solutions</nuxt-link>
        <span>
          <nuxt-link class="item" to="/">Resources</nuxt-link>
          <div class="dropdown">
            <nuxt-link class="item" to="/">Blog</nuxt-link>
            <nuxt-link class="item" to="/">Help Center</nuxt-link>
            <nuxt-link class="item" to="/">Developer API</nuxt-link>
          </div>
        </span>
        <nuxt-link class="item" to="/">Pricing</nuxt-link>
        <nuxt-link class="button" to="/auth/login">Login &rarr;</nuxt-link>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Notifications from "@/components/Notifications.vue";

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
    user: "auth/user",
    organization: "auth/activeOrganization"
  }),
  components: {
    Notifications
  }
})
export default class Card extends Vue {
  private logout() {
    this.$store.dispatch("auth/logout");
    this.$router.push("/");
  }
}
</script>

<style lang="scss" scoped>
.navbar {
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}
.item--type-logo {
  font-weight: bold;
  font-style: italic;
  font-size: 125%;
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
nav .button {
  margin-left: 1.5rem;
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
nav span:hover .dropdown,
nav .item:focus + .dropdown {
  display: block;
}
.dropdown .item {
  padding: 0.5rem 1.5rem;
  display: block;
  width: 100%;
}
nav .item.item--type-user {
  padding-right: 0.5rem;
}
.organization-name {
  margin-left: 0.5rem;
}
</style>
