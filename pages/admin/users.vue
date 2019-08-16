<template>
  <main>
    <h1>Users</h1>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      {{ users.data.length }}
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { emptyPagination } from "../../types/admin";
import Loading from "@/components/Loading.vue";

@Component({
  components: {
    Loading
  }
})
export default class AdminUsers extends Vue {
  users = emptyPagination;
  loading = "";

  private created() {
    this.users = { ...this.$store.getters["admin/users"]() };
  }

  private mounted() {
    this.loading = "Loading your users";
  }
}
</script>

<style lang="scss" scoped></style>
