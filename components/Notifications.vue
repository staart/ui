<template>
  <iframe src="https://opensource.oswaldlabs.com/changelog/"></iframe>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Notifications extends Vue {}
</script>

<style lang="scss" scoped>
iframe {
  border: none;
  width: 100%;
  height: 20rem;
}
</style>
