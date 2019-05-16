<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      heading="Just a moment"
      text="It's been a while since you used Staart, so we're refreshing data for you"
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import { mapGetters } from "vuex";

@Component({
  components: {
    Card,
    LargeMessage,
    Input
  },
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Login extends Vue {
  private mounted() {
    this.$store
      .dispatch("auth/refresh")
      .then(() => this.$router.back())
      .catch(() => {
        this.$store.dispatch("auth/logout");
        this.$router.push("/auth/login");
      });
  }
}
</script>
