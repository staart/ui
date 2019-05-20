<template>
  <div>
    <Settings v-if="activeRoute === 'user-settings'">
      <nuxt />
    </Settings>
    <Manage v-else-if="activeRoute === 'organization-settings'">
      <nuxt />
    </Manage>
    <nuxt v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Settings from "@/components/Settings.vue";
import Manage from "@/components/Manage.vue";

@Component({
  components: {
    Settings,
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
