<template>
  <div class="country">
    <div
      class="flag"
      :style="`background-image: url('https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.3.0/flags/1x1/${code.toLowerCase()}.svg')`"
      :aria-label="showText ? undefined : name"
      data-balloon-pos="up"
    ></div>
    <div v-if="showText">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getAllCountries } from "countries-and-timezones";
const countries = getAllCountries();

@Component({})
export default class Country extends Vue {
  @Prop({ default: "" }) code;
  @Prop({ default: true }) showText;

  get name() {
    return (
      (countries[this.code.toUpperCase()]
        ? countries[this.code.toUpperCase()].name
        : this.code) || this.code
    );
  }
}
</script>

<style lang="scss" scoped>
.country {
  display: inline-block;
  > * {
    display: inline-block;
  }
}
.flag {
  background-color: #aaa;
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
