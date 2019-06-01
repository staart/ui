<template>
  <main>
    <div class="container container--size-small">
      <div class="card">
        {{ organization }}
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: mapGetters({
    organization: "auth/activeOrganization"
  }),
  middleware: "auth"
})
export default class Dashboard extends Vue {
  organization?: any;

  private mounted() {
    if (!this.organization) {
      this.$store
        .dispatch("auth/setOrganization")
        .then(() => {})
        .catch(error => {
          this.$router.replace("/onboarding/organization");
          throw new Error(error);
        });
    }
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
