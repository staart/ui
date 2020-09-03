<template>
  <footer class="footer">
    <div class="container">
      <nav class="column bottom-nav">
        <span>&copy; {{ year }} Staart</span>
        <a href="#">Home</a>
        <a href="#">Pricing</a>
        <a href="#">Docs</a>
        <a href="#">Terms and Privacy</a>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Footer extends Vue {
  year = new Date().getFullYear();
}
</script>

<style>
.bottom-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.bottom-nav * + * {
  margin-left: 2rem;
}
footer.footer {
  padding: 4rem 0 2.5rem 0;
  font-size: 90%;
}
</style>
