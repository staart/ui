<template>
  <div>
    <Navbar />
    <main><nuxt /></main>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Navbar from "@/components/layout/Navbar.vue";
import Footer from "@/components/layout/Footer.vue";

@Component({
  components: { Navbar, Footer }
})
export default class Default extends Vue {}
</script>
