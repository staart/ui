<template>
  <div>
    <Navbar />
    <Layout />
    <Footer />
    <notifications width="100%" group="auth" position="top center" />
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
            document.body.classList.add("prefers-reduced-motion");
        if (this.$store.state.auth.user.prefersColorSchemeDark)
          if (document && document.body)
            document.body.classList.add("prefers-color-scheme-dark");
      }
    } catch (error) {
      console.log(error);
    }
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
  background-color: #f0f1f9;
  color: #130f40;
}

::selection {
  background-color: rgba(73, 34, 87, 0.15);
}

body {
  margin: 0;
}

a {
  color: #714880;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

.container {
  max-width: 1200px;
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
  transition: 0.2s;
  border-radius: 0.2rem;
  border: none;
  background: rgba(180, 0, 240, 0.03);
  color: #492257;
  box-shadow: rgba(73, 34, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(73, 34, 87, 0.12) 0px 2px 5px 0px;
  &:hover {
    box-shadow: rgba(42, 47, 69, 0.2) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.2) 0px 1px 1px 0px, rgba(42, 47, 69, 0.2) 0px 2px 5px 0px;
  }
  &:focus {
    box-shadow: rgba(73, 34, 87, 0.46) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.42) 0px 1px 1px 0px,
      rgba(73, 34, 87, 0.42) 0px 2px 5px 0px, 0 0 0 3px rgba(121, 82, 179, 0.25);
  }
  line-height: 1;
  text-decoration: none;
  display: inline-block;
  padding: 0.75rem 1rem;
  outline: none;
  &:hover {
    text-decoration: none;
  }
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
  background: #492257;
  color: #fff;
  box-shadow: rgba(73, 34, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(73, 34, 87, 0.12) 0px 2px 5px 0px;
  &:focus {
    box-shadow: rgba(73, 34, 87, 0.46) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.42) 0px 1px 1px 0px,
      rgba(73, 34, 87, 0.42) 0px 2px 5px 0px, 0 0 0 3px rgba(121, 82, 179, 0.25);
  }
}
.button--color-blue {
  color: #4285f4;
  background-color: rgba(100, 100, 255, 0.01);
  box-shadow: rgba(66, 133, 244, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    rgba(66, 133, 244, 0.12) 0px 2px 5px 0px;
  &:focus {
    box-shadow: rgba(66, 133, 244, 0.46) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.42) 0px 1px 1px 0px,
      rgba(66, 133, 244, 0.42) 0px 2px 5px 0px,
      0 0 0 3px rgba(121, 82, 179, 0.25);
  }
}
.button--color-danger {
  color: #af1101;
  background-color: rgba(255, 0, 0, 0.01);
  box-shadow: rgba(175, 17, 1, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(175, 17, 1, 0.12) 0px 2px 5px 0px;
  &:hover {
    box-shadow: rgba(175, 17, 1, 0.2) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.2) 0px 1px 1px 0px, rgba(175, 17, 1, 0.2) 0px 2px 5px 0px;
  }
  &:focus {
    box-shadow: rgba(175, 17, 1, 0.46) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.42) 0px 1px 1px 0px,
      rgba(175, 17, 1, 0.42) 0px 2px 5px 0px, 0 0 0 3px rgba(121, 82, 179, 0.25);
  }
}
.button--color-danger-cta {
  background: #af1101 !important;
  color: #fff !important;
  font-weight: bold;
  box-shadow: rgba(175, 17, 1, 0.2) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.3) 0px 1px 1px 0px, rgba(175, 17, 1, 0.3) 0px 2px 5px 0px;
  &:hover {
    box-shadow: rgba(175, 17, 1, 0.5) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.5) 0px 1px 1px 0px, rgba(175, 17, 1, 0.5) 0px 2px 5px 0px;
  }
  &:focus {
    box-shadow: rgba(175, 17, 1, 0.75) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.75) 0px 1px 1px 0px,
      rgba(175, 17, 1, 0.75) 0px 2px 5px 0px, 0 0 0 3px rgba(121, 82, 179, 0.5);
  }
}
.button--type-icon {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.icon--mr-1 {
  margin-right: 0.25rem;
}
.icon--ml-1 {
  margin-left: 0.25rem;
}
.icon--ml-2 {
  margin-left: 0.5rem;
}
.icon--color-danger {
  color: #e74c3c;
}
.icon--color-success {
  color: #2ecc71;
}
.icon--color-gold {
  color: #f1c40f;
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
.text--align-center {
  text-align: center;
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
    padding: 0.75rem 1rem;
    .button {
      margin: -0.75rem 0;
    }
    .button + .button {
      margin-left: 0.5rem;
    }
  }
  th {
    border-bottom: 2px solid rgba(180, 0, 240, 0.04);
  }
  tr:nth-child(even) {
    background-color: rgba(180, 0, 240, 0.04);
  }
  &.table--type-cols {
    td:first-child {
      font-weight: bold;
    }
    td:last-child {
      text-align: right;
    }
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
    &:last-child {
      margin-bottom: 0;
    }
  }
}

form,
div,
section,
table,
p,
input,
button {
  + h1,
  + h2 {
    margin-top: 2.5rem;
  }
}

p {
  max-width: 720px;
}

.row {
  display: flex;
  justify-content: space-between;
  > * {
    flex: 1 0 0;
    margin-right: 1rem;
    &:last-child {
      margin-right: 0;
    }
  }
}

.card {
  width: 100%;
  background-color: #fff;
  border-radius: 0.2rem;
  box-shadow: 0 7px 14px 0 rgba(60, 66, 87, 0.075),
    0 3px 6px 0 rgba(0, 0, 0, 0.035);
  &.card--type-padded {
    padding: 2rem;
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

code {
  font-size: 110%;
  background-color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.2rem;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.035);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
  .card {
    margin-top: 0;
    transition: margin-top 0.3s;
  }
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
  .card {
    margin-top: -10px;
  }
}

.prefers-color-scheme-dark {
  background-color: #151d21;
  color: rgba(255, 255, 255, 0.95);
  ::selection {
    background-color: rgba(255, 255, 255, 0.1);
  }
  a {
    color: #fff;
  }
  .card,
  .item.nuxt-link-active,
  .dropdown {
    background-color: #263238 !important;
  }
  .button {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.05);
    box-shadow: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px,
      rgba(255, 255, 255, 0.5) 0px 1px 1px 0px,
      rgba(255, 255, 255, 0.1) 0px 2px 5px 0px;
  }
  input,
  select,
  code {
    background-color: #121415 !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    color: #fff !important;
    &:focus {
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25) !important;
    }
  }
  .item.nuxt-link-active {
    color: #fff !important;
    box-shadow: -7px 10px 10px rgba(255, 255, 255, 0.02), 2px 0 0 #263238 !important;
  }
  .table tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.04);
  }
  .text--color-light {
    color: rgba(255, 255, 255, 0.5) !important;
  }
}
</style>
