<template>
  <Trap>
    <div class="modal-back">
      <button
        v-if="!disableBackgroundClose"
        class="close"
        aria-label="Close"
        @click="close"
      >
        &times;
      </button>
      <div class="card card--type-padded modal-front">
        <slot />
        <div v-if="disableBackgroundClose">
          <button class="button" @click="onClose">{{ closeText }}</button>
        </div>
      </div>
      <div class="background" @click="close"></div>
    </div>
  </Trap>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Trap from "vue-focus-lock";

@Component({
  components: {
    Trap
  }
})
export default class Modal extends Vue {
  @Prop() onClose;
  @Prop({ default: false }) disableBackgroundClose;
  @Prop({ default: "Close" }) closeText;
  private close() {
    if (!this.disableBackgroundClose) this.onClose();
  }
}
</script>

<style lang="scss" scoped>
.background {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}
.card {
  z-index: 1000;
  position: relative;
}
.modal-back {
  background-color: rgba(108, 112, 142, 0.5);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
  z-index: 999;
  .close {
    position: fixed;
    right: 0;
    right: 0;
    z-index: 1000;
    font: inherit;
    text-align: right;
    font-size: 250%;
    line-height: 1;
    padding: 0.5rem 1rem;
    appearance: none;
    color: #000;
    opacity: 0.5;
    background: none;
    border: none;
  }
}
.modal-front {
  margin: 10vh auto;
  max-width: 500px;
  box-shadow: 0 7px 14px 0 rgba(60, 66, 87, 0.2), 0 3px 6px 0 rgba(0, 0, 0, 0.1);
}
.prefers-color-scheme-dark .modal-back {
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
