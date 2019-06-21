<template>
  <div>
    <font-awesome-icon class="spinner" icon="sync" spin />
    <div>{{ message }}...</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
library.add(faSync);

@Component({
  components: {
    FontAwesomeIcon
  }
})
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
  margin: 2rem 0;
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
