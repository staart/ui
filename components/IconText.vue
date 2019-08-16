<template>
  <div class="icon-text">
    <div
      v-if="image"
      class="flag"
      :style="`background-image: url('${image}')`"
      :aria-label="showText ? undefined : name"
      data-balloon-pos="up"
    ></div>
    <div v-if="showText">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import analyticsIcons from "analytics-icons";

@Component({})
export default class Country extends Vue {
  @Prop({ default: "" }) text;
  @Prop({ default: "brand" }) type;
  @Prop({ default: true }) showText;

  get image() {
    if (this.text === "" || this.text === "unknown") return;
    if (this.type === "domain") return `https://unavatar.now.sh/${this.text}`;
    return analyticsIcons(this.text);
  }

  get name() {
    return this.text || "Name";
  }
}
</script>

<style lang="scss" scoped>
.icon-text {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  > * {
    display: inline-block;
  }
}
.flag {
  margin: -1.33rem 0.5rem -1rem 0;
  width: 2rem;
  height: 2rem;
  vertical-align: middle;
  border-radius: 100%;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
