<template>
  <div>
    <Navbar />
    <nuxt />
    <Footer />
    <notifications width="100%" group="auth" position="top center" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

@Component({
  components: {
    Navbar,
    Footer
  }
})
export default class Default extends Vue {
  private created() {
    try {
      if (this.$store.state.auth.isAuthenticated)
        this.$axios.setToken(this.$store.state.auth.tokens.token, "Bearer");
    } catch (error) {}
  }
}
</script>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #f7f8fb;
}

body {
  margin: 0;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}
.container--size-small {
  max-width: 400px;
}
.container--top-20height {
  margin-top: 15vh;
}
.container--bottom-20height {
  margin-bottom: 15vh;
}

.vue-notification.notification {
  font-size: inherit;
  margin: 3rem 0 0 0;
  color: #fff;
  background: none;
  border-left: none;
  text-align: center;
  .notification-content {
    display: inline-block;
    margin: 0 auto;
    text-align: center;
    line-height: 1;
    background-color: #35495e;
    padding: 0.5rem 1rem;
    border-radius: 20rem;
    cursor: pointer;
    &::after {
      content: "×";
      font-weight: bold;
      display: inline-block;
      transform: translateY(-0.1rem) scale(1.25);
      margin-left: 0.75rem;
    }
  }
  .notification-title {
    display: none;
  }
}
.vue-notification.notification--color-danger .notification-content {
  background-color: #c0392b;
}
.vue-notification.notification--color-success .notification-content {
  background-color: #27ae60;
}

.button {
  font: inherit;
  border-radius: 0.2rem;
  border: 1px solid #ddd;
  line-height: 1;
  text-decoration: none;
  display: inline-block;
  padding: 0.75rem 1rem;
}
.button--size-large {
  font-size: 120%;
  padding: 1rem 1.25rem;
}
.button--width-full {
  display: block;
  width: 100%;
  box-sizing: border-box;
}
.button--color-primary {
  color: #1abc9c;
  border-color: #1abc9c;
}
.button--color-blue {
  color: #69e;
  border-color: #69e;
}

.text--size-small {
  font-size: 80%;
}
.text--lh-1 {
  line-height: 1.25;
}
.text--color-light {
  color: #555;
}
.text--align-right {
  text-align: right;
}

.section--mt-05 {
  margin-top: 0.5rem;
}
.section--mt-1 {
  margin-top: 1rem;
}

.table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  td,
  th {
    vertical-align: middle;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    .button {
      margin: -0.75rem 0;
    }
  }
  tr:nth-child(even) {
    background-color: whitesmoke;
  }
}

h1 {
  margin: 0 0 2rem 0;
  font-size: 150%;
}
h2 {
  margin: 0 0 1.5rem 0;
  font-size: 125%;
}
h1,
h2 {
  + p {
    margin-top: -1.25rem;
    margin-bottom: 2rem;
  }
}

form,
div,
section,
table,
p {
  + h1,
  + h2 {
    margin-top: 2.5rem;
  }
}

[data-balloon]::after {
  font: inherit !important;
  font-size: 90% !important;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>
