<template>
  <div>
    <label class="field-label" :for="id">Destination {{ val }}</label>
    <div class="autocomplete">
      <input
        :id="id"
        v-model="search"
        autocapitalize="none"
        type="text"
        autocomplete="off"
        :aria-owns="`autocomplete-options--${id}`"
        aria-autocomplete="list"
        role="combobox"
        aria-expanded="false"
        @keyup="filter"
      />
      <ul :id="`autocomplete-options--${id}`" role="listbox" class="hidden">
        <li v-for="(item, index) in filteredItems" :key="`li${id}${index}`">
          <button @click="selectOption(index)">{{ item.value }}</button>
        </li>
      </ul>
      <div aria-live="polite" role="status" class="visually-hidden">
        {{ filteredItems.length }} results available.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Autocomplete extends Vue {
  id = "";
  search = "";
  val: string | null = null;
  @Prop({ default: {}, required: true }) options;
  items = {};
  filteredItems = {};
  listener = () => {};

  created() {
    this.id = `id-${Math.random()
      .toString()
      .replace(".", "")}`;
    this.normalize();
    this.filteredItems = this.items;
    if (process.client) document.addEventListener("click", this.listener);
  }
  beforeDestroy() {
    if (process.client) document.removeEventListener("click", this.listener);
  }
  @Watch("options")
  onOptionsChanged() {
    this.normalize();
  }
  normalize() {
    const items = {};
    if (Array.isArray(this.options)) {
      for (let i = 0; i < this.options.length; i++) {
        items[`v${i}`] = this.options[i];
      }
    } else {
      Object.keys(this.options).forEach(key => {
        if (typeof this.options[key] === "object") {
          items[key] = this.options[key];
        } else {
          items[key] = {
            value: this.options[key]
          };
        }
      });
    }
    this.items = items;
  }

  filter() {
    if (!this.search) {
      this.val = null;
      this.filteredItems = this.items;
    }
    const items = {};
    let exactValue: string | null = null;
    Object.keys(this.items).forEach(key => {
      if (
        this.items[key].value.toLowerCase().includes(this.search.toLowerCase())
      ) {
        items[key] = this.items[key];
      }
      if (this.items[key].value.toLowerCase() === this.search.toLowerCase())
        exactValue = key;
    });
    this.filteredItems = items;
    this.val = exactValue;
  }
  selectOption(index: string) {
    this.search = this.filteredItems[index].value;
    this.filteredItems = this.items;
    this.val = index;
  }
}
</script>

<style lang="scss">
.autocomplete {
  position: relative;
}
</style>
