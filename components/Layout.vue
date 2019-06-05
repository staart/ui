<template>
  <div id="content">
    <Settings v-if="activeRoute === 'user-settings'">
      <nuxt />
    </Settings>
    <Manage v-else-if="activeRoute === 'organization-settings'">
      <nuxt />
    </Manage>
    <Policies v-else-if="activeRoute === 'policies'">
      <nuxt />
    </Policies>
    <nuxt v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Settings from "@/components/Settings.vue";
import Manage from "@/components/Manage.vue";
import Policies from "@/components/Policies.vue";

@Component({
  components: {
    Settings,
    Policies,
    Manage
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
    } else if (this.$route.path.startsWith("/manage")) {
      this.activeRoute = "organization-settings";
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
