<template>
  <main
    class="container container--size-small container--top-20height container--bottom-20height"
  >
    <LargeMessage
      img="undraw_loading_frh4.svg"
      heading="Just a moment"
      text="It's been a while since you used Staart, so we're refreshing data for you"
    />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Card from "@/components/Card.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";

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
