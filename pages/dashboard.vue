<template>
  <div>
    <h1>Welcome</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Dashboard extends Vue {}
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 10vh 0;
  margin-bottom: 10vh;
  h1 {
    margin: 0 0 2rem 0;
  }
}
</style>
