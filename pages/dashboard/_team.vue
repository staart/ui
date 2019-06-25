<template>
  <main>
    <div
      class="container container--size-medium container--top-20height container--bottom-20height"
    >
      <div class="card card--type-padded text text--align-center">
        <h1>Dashboard</h1>
        <p>
          The main page for your SaaS comes here. Whatever is the most important
          thing for your product should come here.
        </p>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";

@Component({
  middleware: "auth",
  components: {
    Loading
  }
})
export default class Dashboard extends Vue {
  private mounted() {}
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
