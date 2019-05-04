<template>
  <div>
    <header>
      <div class="container">
        <h1>Get work done with Product.</h1>
        <div v-if="isAuthenticated">
          <nuxt-link
            class="button button--size-large button--color-primary"
            to="/dashboard"
            >Go to your dashboard &rarr;</nuxt-link
          >
        </div>
        <div v-else>
          <nuxt-link
            class="button button--size-large button--color-primary"
            to="/auth/register"
            >Get started for free &rarr;</nuxt-link
          >
        </div>
      </div>
    </header>
    <main class="container section section--mt-1">
      Your landing page comes here.
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: mapGetters({
    isAuthenticated: "auth/isAuthenticated"
  })
})
export default class Home extends Vue {
  async mounted() {
    const data = await this.$axios.$get("/");
    console.log(data);
  }
}
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 10vh 0;
  margin-bottom: 10vh;
  h1 {
    margin: 0 0 2rem 0;
  }
}
</style>
