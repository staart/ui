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
                :to="`/admin${item.to}`"
                :active="$route.path === `/admin${item.to}`"
                :expanded="$route.path.includes(`/admin${item.to}`)"
              >
                <b-menu-item
                  v-for="(item, i) in item.items"
                  :key="`i${i}${item.to}`"
                  :icon="item.icon"
                  :label="item.label"
                  tag="router-link"
                  :to="`/admin${item.to}`"
                  :active="$route.path === `/admin${item.to}`"
                />
              </b-menu-item>
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
      label: "Dashboard",
      icon: "server-security",
      to: ""
    },
    {
      label: "Payments",
      icon: "cash-multiple",
      to: "/payments"
    },
    {
      label: "Teams",
      icon: "account-group",
      to: "/teams"
    },
    {
      label: "Users",
      icon: "account",
      to: "/users"
    },
    {
      label: "Coupon codes",
      icon: "credit-card-plus",
      to: "/coupons"
    },
    {
      label: "Server logs",
      icon: "chart-areaspline-variant",
      to: "/server-logs"
    }
  ];
}
</script>
