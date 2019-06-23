<template>
  <div>
    <img alt="" :src="`/images/${img}`" />
    <h1>{{ heading }}</h1>
    <p>{{ text }}</p>
    <nuxt-link
      v-if="ctaText && ctaTo"
      class="button button--size-large button--color-primary section section--mt-1"
      :to="ctaTo"
      >{{ ctaText }} &rarr;</nuxt-link
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class LargeMessage extends Vue {
  @Prop() heading;
  @Prop() text;
  @Prop() ctaText;
  @Prop() ctaTo;
  @Prop({ default: "undraw_scooter_aia8.svg" }) img;
}
</script>

<style lang="scss" scoped>
div {
  text-align: center;
  max-width: 400px;
  margin: auto;
}
h1 {
  font-size: 200%;
  font-weight: 300;
}
img {
  max-width: 300px;
  margin-bottom: 1rem;
}
</style>
