<template>
  <div class="form-group">
    <label>
      <input
        :checked="value"
        type="checkbox"
        :required="required"
        @change="$emit('input', $event.target.checked)"
      />
      <span>{{ label }}</span>
    </label>
    <div
      v-if="help"
      class="text text--size-small text--color-light text--lh-1 section section--mt-05"
    >
      {{ help }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Checkbox extends Vue {
  @Prop({ default: "text" }) type;
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() placeholder;
  @Prop() help;
  @Prop() autocomplete;
  labelId = Math.random()
    .toString(36)
    .substring(7);
}
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    display: inline-block;
    width: auto;
  }
}
</style>
