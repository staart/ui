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
  background-color: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 0.2rem;
}
h1 {
  font-size: 125%;
}
</style>
