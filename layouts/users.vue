<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="columns">
        <aside class="column">
          <b-menu :activable="false">
            <b-menu-list>
              <b-menu-item
                v-for="(item, i) in items"
                :key="`i${i}${item.to}`"
                :icon="item.icon"
                :label="item.label"
                tag="router-link"
                :to="`/users/${$route.params.id}${item.to}`"
                :active="$route.path === `/users/${$route.params.id}${item.to}`"
              />
            </b-menu-list>
          </b-menu>
        </aside>
        <main class="column is-three-quarters card">
          <div class="card-content">
            <nuxt />
          </div>
        </main>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";

@Component({
  components: { Navbar, Footer }
})
export default class Default extends Vue {
  items = [
    {
      label: "Profile",
      icon: "face-profile-woman",
      to: "/profile"
    },
    {
      label: "Teams",
      icon: "account-group",
      to: "/teams"
    },
    {
      label: "Emails",
      icon: "email",
      to: "/emails"
    },
    {
      label: "Passwords & 2FA",
      icon: "security",
      to: "/passwords"
    },
    {
      label: "Sessions",
      icon: "login",
      to: "/sessions"
    },
    {
      label: "Access tokens",
      icon: "code-braces",
      to: "/access-tokens"
    },
    {
      label: "Data and privacy",
      icon: "database",
      to: "/data"
    }
  ];
}
</script>

<style scoped>
aside.column {
  margin-top: 7rem;
}
</style>
