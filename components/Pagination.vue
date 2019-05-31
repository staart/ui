<template>
  <nav
    v-if="numberOfPages !== 1"
    class="pagination"
    role="navigation"
    aria-label="Pagination Navigation"
  >
    <button
      class="button"
      :disabled="activePage === 1"
      aria-label="Previous page"
      @click="() => activePage--"
    >
      <font-awesome-icon class="icon" icon="arrow-left" />
    </button>
    <button
      v-for="page in showPages"
      :key="`p${page}`"
      :aria-label="
        page === activePage ? `Current page, page ${page}` : `Page ${page}`
      "
      :aria-current="page === activePage"
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
      aria-label="Next page"
      @click="() => activePage++"
    >
      <font-awesome-icon class="icon" icon="arrow-right" />
    </button>
  </nav>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowRight, faArrowLeft);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Pagination extends Vue {
  @Prop({ default: 0 }) numberOfItems;
  @Prop({ default: 10 }) itemsPerPage;
  @Prop() onChange;
  activePage = 1;
  get numberOfPages() {
    return Math.max(Math.floor(this.numberOfItems / this.itemsPerPage), 1);
  }
  get showPages() {
    const startPage = Math.max(1, this.activePage - 2);
    const endPage = Math.min(this.activePage + 2, this.numberOfPages);
    const x: number[] = [];
    for (let i = startPage; i <= endPage; i++) x.push(i);
    return x;
  }
  @Watch("activePage")
  onPageChanged(activePage: number) {
    if (typeof this.onChange === "function") return this.onChange(activePage);
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
  font-weight: bold;
}
</style>
