<template>
  <div>
    <Settings v-if="activeRoute === 'user-settings'">
      <nuxt />
    </Settings>
    <nuxt v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Settings from "@/components/Settings.vue";

@Component({
  components: {
    Settings
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
