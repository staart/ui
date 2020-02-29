<template>
  <div id="content">
    <Admin v-if="activeRoute === 'admin'">
      <nuxt />
    </Admin>
    <Users v-else-if="activeRoute === 'users'">
      <nuxt />
    </Users>
    <TeamLayout v-else-if="activeRoute === 'teams'">
      <nuxt />
    </TeamLayout>
    <Policies v-else-if="activeRoute === 'policies'">
      <nuxt />
    </Policies>
    <nuxt v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Admin from "@/components/Admin.vue";
import Users from "@/components/Users.vue";
import TeamLayout from "@/components/TeamLayout.vue";
import Policies from "@/components/Policies.vue";

@Component({
  components: {
    Users,
    Admin,
    Policies,
    TeamLayout
  }
})
export default class Layout extends Vue {
  activeRoute = "default";
  private created() {
    this.updateLayout();
  }

  private updateLayout() {
    if (this.$route.path.startsWith("/settings")) {
      this.activeRoute = "user-settings";
    } else if (this.$route.path.startsWith("/teams")) {
      this.activeRoute = "teams";
    } else if (this.$route.path.startsWith("/admin")) {
      this.activeRoute = "admin";
    } else if (this.$route.path.startsWith("/users")) {
      this.activeRoute = "users";
    } else if (this.$route.path.startsWith("/policies")) {
      this.activeRoute = "policies";
    } else {
      this.activeRoute = "default";
    }
  }

  @Watch("$route")
  onRouteChanged() {
    this.updateLayout();
  }
}
</script>

<style lang="scss" scoped></style>
