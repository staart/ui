<template>
  <div class="form-group">
    <label :for="labelId">{{ label }}</label>
    <table class="table">
      <tbody>
        <tr v-for="(item, index) in list" :key="`p_${index}`">
          <td>
            <Input
              :id="labelId"
              :value="item"
              :placeholder="placeholder"
              :autocomplete="autocomplete"
              :required="required"
              v-bind="$attrs"
              :disabled="disabled"
              @input="val => input(index, val)"
            />
          </td>
          <td v-if="!disabled" class="text text--align-right">
            <button
              aria-label="Remove"
              data-balloon-pos="up"
              class="button button--type-icon button--color-danger"
              type="button"
              @click.prevent="remove(index)"
            >
              <font-awesome-icon
                class="icon icon--color-danger"
                icon="times"
                fixed-width
              />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      v-if="!disabled"
      class="button button--type-icon"
      type="button"
      @click.prevent="add"
    >
      <font-awesome-icon class="icon icon--mr-1" icon="plus" fixed-width />
      <span>Add another</span>
    </button>
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
import Input from "@/components/form/Input.vue";
library.add(faTimes, faPlus);

@Component({
  components: {
    FontAwesomeIcon,
    Input
  }
})
export default class CommaList extends Vue {
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() placeholder;
  @Prop() help;
  @Prop() autocomplete;
  @Prop({ default: false }) disabled;
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

  private remove(index) {
    this.list.splice(index, 1);
    this.update();
  }

  private input(index, val) {
    this.list[index] = val;
    this.update();
  }

  private update() {
    this.commaList = this.list.filter(item => !!item).join(",");
    this.$emit("input", this.commaList);
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  label {
    display: block;
    margin-bottom: -0.5rem;
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
