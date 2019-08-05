<template>
  <div>
    <a href="#content" class="sr-only sr-only-focusable sk">Skip navigation</a>
    <Navbar />
    <Layout />
    <Footer />
    <no-ssr>
      <notifications
        aria-live="alert"
        width="100%"
        group="auth"
        position="top center"
      />
    </no-ssr>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
import Layout from "@/components/Layout.vue";
import Footer from "@/components/Footer.vue";

@Component({
  components: {
    Navbar,
    Layout,
    Footer
  }
})
export default class Default extends Vue {
  private created() {
    try {
      if (this.$store.state.auth.isAuthenticated)
        this.$axios.setToken(this.$store.state.auth.tokens.token, "Bearer");
      if (this.$store.state.auth && this.$store.state.auth.user) {
        if (this.$store.state.auth.user.prefersReducedMotion)
          if (document && document.body)
            document.documentElement.classList.add("prefers-reduced-motion");
        if (this.$store.state.auth.user.prefersColorSchemeDark)
          if (document && document.body)
            document.documentElement.classList.add("prefers-color-scheme-dark");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style lang="scss">
@import "../styles/app.scss";
</style>
