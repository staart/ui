<template>
  <div class="has-background-white-bis">
    <Navbar type="is-black" style="background-color: #210042" />
    <b-navbar
      wrapper-class="container"
      type="is-black"
      :transparent="true"
      class="subnavbar"
    >
      <template slot="start">
        <b-navbar-item href="#">
          User settings
        </b-navbar-item>
        <b-navbar-item href="#">
          Teams
        </b-navbar-item>
        <b-navbar-item href="#">
          Developer
        </b-navbar-item>
      </template>
    </b-navbar>
    <div class="container">
      <div class="columns">
        <aside class="column">
          <b-menu :activable="false">
            <b-menu-list label="User">
              <b-menu-item
                v-for="(item, i) in items"
                :key="`i${i}${item.to}`"
                :icon="item.icon"
                :label="item.label"
                tag="router-link"
                :to="`/users/${$route.params.username}/${item.to}`"
                :active="
                  $route.path === `/users/${$route.params.username}/${item.to}`
                "
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
      icon: "information-outline",
      to: "profile"
    },
    {
      label: "Emails",
      icon: "email-outline",
      to: "emails"
    },
    {
      label: "Passwords & 2FA",
      icon: "information-outline",
      to: "passwords"
    },
    {
      label: "Connected accounts",
      icon: "information-outline",
      to: "connected-accounts"
    },
    {
      label: "Sessions",
      icon: "information-outline",
      to: "sessions"
    },
    {
      label: "Data and privacy",
      icon: "information-outline",
      to: "data"
    }
  ];
}
</script>

<style scoped>
.container {
  margin-top: -3rem;
  position: relative;
  z-index: 31;
  max-width: 1000px;
}
aside {
  margin-top: 4rem;
}
.subnavbar {
  padding: 0.5rem 0;
  margin-top: -1.5rem;
  background-color: #210042;
  padding-bottom: 5rem;
}
</style>

<style>
.is-transparent {
  background-color: transparent;
}
</style>
