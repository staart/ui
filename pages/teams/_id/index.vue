<template>
  <div>Your dashboard will go here...</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class TeamsHome extends Vue {}
</script>
