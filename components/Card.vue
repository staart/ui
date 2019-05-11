<template>
  <div class="card">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Card extends Vue {}
</script>

<style lang="scss" scoped>
.card {
  padding: 1.5rem;
}
h1 {
  font-size: 125%;
  margin-bottom: 1rem;
  margin-top: 0;
}
</style>
