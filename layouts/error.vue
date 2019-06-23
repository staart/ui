<template>
  <main class="container container--size-small container--type-padded">
    <div class="card card--type-padded">
      <LargeMessage
        img="undraw_cancel_u1it.svg"
        :heading="`Error ${error.statusCode}`"
        :text="error.message"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import LargeMessage from "@/components/LargeMessage.vue";

@Component({
  components: {
    LargeMessage
  }
})
export default class Error extends Vue {
  @Prop() error;
}
</script>
