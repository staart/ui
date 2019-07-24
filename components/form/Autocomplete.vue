<template>
  <div>
    <label v-if="label" class="field-label" :for="id">{{ label }}</label>
    <div class="autocomplete">
      <input
        :id="id"
        ref="input"
        v-model="search"
        :placeholder="placeholder"
        type="text"
        role="combobox"
        class="input"
        autocapitalize="none"
        autocomplete="off"
        :aria-owns="`autocomplete-options--${id}`"
        aria-autocomplete="list"
        aria-expanded="false"
        @keyup="filter"
        @focus="optionsVisible = true"
        @blur="checkAndHide"
      />
      <ul
        v-show="optionsVisible"
        v-if="Object.keys(filteredItems).length"
        :id="`autocomplete-options--${id}`"
        role="listbox"
        tabindex="-1"
        class="autocomplete-options"
      >
        <li
          v-for="(item, index) in filteredItems"
          :key="`li${id}${index}`"
          role="option"
          tabindex="0"
          @click="selectOption(index)"
          @keyup="event => tryOption(event, index)"
        >
          <span
            v-if="item.img"
            class="option-image"
            aria-hidden="true"
            :style="`background-image: url('${item.img}')`"
          />
          <span>{{ item.value }}</span>
        </li>
      </ul>
      <div aria-live="polite" role="status" class="sr-only">
        {{ Object.keys(filteredItems).length }} results available.
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
  optionsVisible = false;
  @Prop({ default: {}, required: true }) options;
  @Prop() label;
  @Prop() value;
  @Prop() placeholder;
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
        items[`v${i}`] = {
          value: String(this.options[i])
        };
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
    this.val = this.value;
    if (this.value) this.search = this.items[this.value].value;
  }

  filter() {
    this.optionsVisible = true;
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
    this.optionsVisible = false;
    this.$emit("input", this.val);
  }
  tryOption(event: KeyboardEvent, index: string) {
    if (event.keyCode === 13) {
      this.selectOption(index);
    } else if (event.keyCode > 64 && event.keyCode < 100) {
      (this.$refs.input as HTMLInputElement).focus();
      this.search +=
        event.shiftKey || event.getModifierState("CapsLock")
          ? String.fromCharCode(event.keyCode)
          : String.fromCharCode(event.keyCode).toLowerCase();
    }
  }
  checkAndHide() {
    if (!this.val) this.search = "";
    setTimeout(() => {
      console.log(document.activeElement);
      if (document.activeElement && document.activeElement.nodeName === "LI") {
      } else this.optionsVisible = false;
    }, 250);
  }
}
</script>

<style lang="scss">
.autocomplete {
  position: relative;
  input {
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
    border: 1px solid rgba(121, 82, 179, 0.25);
    background-color: #fff;
  }
  .option-image {
    width: 2rem;
    background-size: cover;
    display: inline-block;
  }
  .autocomplete-options {
    margin: 0;
    padding: 0.5rem 0;
    list-style: none;
    position: absolute;
    z-index: 10;
    max-height: 10rem;
    overflow-y: auto;
    left: 0;
    right: 0;
    top: 110%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 0.2rem;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    li {
      margin: 0;
      padding: 0;
      display: flex;
      width: 100%;
      align-items: stretch;
      font-weight: normal;
      &:hover,
      &:focus {
        background-color: #eee;
      }
      span:last-child {
        display: inline-block;
        padding: 0.75rem 1rem;
      }
    }
  }
}
</style>
