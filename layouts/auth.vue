<template>
  <div>
    <Navbar />
    <main>
      <template>
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-two-fifths">
              <div class="card">
                <div class="card-content">
                  <nuxt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
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
export default class Auth extends Vue {}
</script>

<style scoped></style>
