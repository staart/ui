<template>
  <Modal :on-close="onClose">
    <slot />
  </Modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Modal from "@/components/Modal.vue";

@Component({
  components: {
    Modal
  }
})
export default class Confirm extends Vue {
  @Prop() onClose;
}
</script>
