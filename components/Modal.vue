<template>
  <div>
    <div class="card card--type-padded modal-front">
      <slot />
    </div>
    <div class="modal-back" @click="close">
      <button>&times;</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Modal extends Vue {
  @Prop() onClose;
  private close() {
    this.onClose();
  }
}
</script>

<style lang="scss" scoped>
.modal-back {
  background-color: rgba(108, 112, 142, 0.5);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  text-align: right;
  font-size: 250%;
  line-height: 1;
  padding: 0.5rem 1rem;
  button {
    font: inherit;
    appearance: none;
    color: #fff;
    background: none;
    border: none;
  }
}
.button + .button {
  margin-left: 0.5rem;
}
.modal-front {
  position: fixed;
  z-index: 1001;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  box-shadow: 0 7px 14px 0 rgba(60, 66, 87, 0.2), 0 3px 6px 0 rgba(0, 0, 0, 0.1);
}
</style>
