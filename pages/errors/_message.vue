<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      v-if="$route.params.message === 'unapproved-location'"
      heading="Verify new location"
      text="It looks like you're logging in from a new location. Please click on the verification link sent to your email."
    />
    <LargeMessage
      v-else
      heading="An error ocurred"
      text="We're not sure what happened, but it doesn't look good. Perhaps you'll be more comfortable at home."
      cta-text="Go to the homepage"
      cta-to="/"
    />
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
export default class Errors extends Vue {}
</script>
