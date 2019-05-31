<template>
  <div class="pagination">
    <button
      class="button"
      :disabled="activePage === 1"
      @click="() => activePage--"
    >
      <span>Prev</span>
    </button>
    <button
      v-for="page in showPages"
      :key="`p${page}`"
      :class="
        `button button--type-${page === activePage ? 'active' : 'inactive'}`
      "
      @click="() => (activePage = page)"
    >
      <span>{{ page }}</span>
    </button>
    <button
      class="button"
      :disabled="activePage === numberOfPages"
      @click="() => activePage++"
    >
      <span>Next</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Pagination extends Vue {
  numberOfItems = 100;
  itemsPerPage = 3;
  activePage = 10;
  get numberOfPages() {
    return Math.floor(this.numberOfItems / this.itemsPerPage);
  }
  get showPages() {
    const startPage = Math.max(1, this.activePage - 5);
    const endPage = Math.min(this.activePage + 5, this.numberOfPages);
    return [startPage, endPage];
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 1rem;
}
button + button {
  margin-left: 0.5rem;
}
.button--type-active {
  background-color: #fff;
}
</style>
