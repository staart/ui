<template>
  <div class="form-group">
    <label :for="labelId">{{ label }}</label>
    <button type="button" class="button button--size-small" @click="select">
      Select all
    </button>
    <button
      type="button"
      class="button button--size-small"
      style="margin-left: 0.5rem"
      @click="deselect"
    >
      Deselect all
    </button>
    <div class="checklist-items">
      <div
        v-for="(item, index) in options"
        :key="`i_${index}`"
        class="checklist-item"
      >
        <Checkbox
          :value="item.alwaysChecked ? true : list.indexOf(index) > -1"
          :label="item.text"
          :help="item.help"
          :question-mark="true"
          :disabled="item.alwaysChecked"
          @input="val => input(index, val)"
        />
      </div>
    </div>
    <div
      v-if="help"
      class="text text--size-small text--color-light text--lh-1 text text--mt-05"
    >
      {{ help }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@/components/form/Checkbox.vue";
library.add(faTimes, faPlus);

@Component({
  components: {
    FontAwesomeIcon,
    Checkbox
  }
})
export default class CommaList extends Vue {
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() placeholder;
  @Prop() help;
  @Prop() autocomplete;
  @Prop({ required: true }) options;
  labelId = "";
  list = [""];
  commaList = "";

  private created() {
    this.labelId = Math.random()
      .toString(36)
      .substring(7);
  }

  private mounted() {
    if (this.value) this.list = this.value.split(",");
  }

  private add() {
    this.list.push("");
    this.update();
  }

  private remove(key: string) {
    const index = this.list.indexOf(key);
    if (index > -1) this.list.splice(index, 1);
  }

  private input(index, val) {
    this.remove(index);
    if (val || this.options[index].alwaysChecked) {
      this.list.push(index);
    }
    this.update();
  }

  private update() {
    this.commaList = this.list.filter(item => !!item).join(",");
    this.$emit("input", this.commaList);
  }

  private select() {
    this.list = Object.keys(this.options);
    this.update();
  }

  private deselect() {
    this.list = [""];
    this.update();
  }
}
</script>

<style lang="scss" scoped>
.checklist-items {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  .checklist-item {
    width: 300px;
  }
}
.form-group {
  margin-bottom: 1rem;
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }
  table {
    margin-bottom: 1rem;
    td,
    th {
      padding: 0;
      padding-top: 0.5rem;
      &:last-child {
        width: 7%;
      }
    }
    tr:nth-child(even) {
      background-color: transparent;
    }
  }
  input {
    font: inherit;
    padding: 0.75rem;
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0.2rem;
    border: 1px solid rgba(121, 82, 179, 0.25);
    background-color: #fff;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(121, 82, 179, 0.25);
    }
  }
}
</style>
