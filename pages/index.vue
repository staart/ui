<template>
  <section class="section">
    Go to landing homepage or your dashboard?
  </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated"
})
export default class Homepage extends Vue {
}
</script>
