<template>
  <div>Your main settings will go here...</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class TeamsHome extends Vue {
  created() {
    // this.$router.replace(`/teams/${this.$route.params.id}/settings/team`);
  }
}
</script>
