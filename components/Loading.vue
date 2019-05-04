<template>
  <div>
    <div class="spinner"></div>
    <div>{{ message }}...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Loading extends Vue {
  @Prop({ default: "Loading" }) message;
}
</script>

<style lang="scss" scoped>
div {
  text-align: center;
}
.spinner {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 0.25rem solid #000;
  border-color: #000 transparent #000 transparent;
  margin: 2rem auto;
  animation-name: rotate;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: 0.5;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
