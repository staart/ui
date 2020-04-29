<template>
  <div v-if="state === 'loading'">
    <h1 class="title is-4">Loading...</h1>
    <div class="content"></div>
  </div>
  <div v-else>
    <h1 class="title is-4">Error</h1>
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  layout: "auth",
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated",
  }),
})
export default class Login extends Vue {
  state = "loading";

  async mounted() {
    try {
      const newToken: string = await this.$store.dispatch("auth/refresh");
      this.$axios.setHeader("Authorization", newToken);
      console.log("Updated new token", newToken);
      this.$router.go(-1);
    } catch (error) {
      console.log("Got error, logging out");
      this.$store.dispatch("auth/logout");
      this.$router.replace("/");
    }
  }
}
</script>
