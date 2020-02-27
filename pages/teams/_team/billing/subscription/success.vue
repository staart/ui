<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <div class="card card--type-padded">
      <LargeMessage
        img="undraw_confirmation_2uy0.svg"
        heading="Working on it..."
        text="We're not sure what happened, but it doesn't look good. Perhaps you'll be more comfortable at home."
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LargeMessage from "@/components/LargeMessage.vue";

@Component({
  components: {
    LargeMessage
  }
})
export default class SuccessSubscription extends Vue {
  private created() {}
}
</script>
