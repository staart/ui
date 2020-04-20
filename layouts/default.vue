<template>
  <div>
    <Navbar />
    <main><nuxt /></main>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Staart</strong> by
          <a href="https://anandchowdhary.com">Anand Chowdhary</a> from
          <a href="https://o15y.com">O15Y</a>. The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-class-component";
import Navbar from "@/components/layout/Navbar.vue";

@Component({
  components: { Navbar }
})
export default class Navbar extends Vue {
  message: string = "Hello!";
}
</script>
