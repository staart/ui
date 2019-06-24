<template>
  <div class="form-group">
    <label :for="labelId">{{ label }}</label>
    <img alt="" :src="value" />
    <input
      :id="labelId"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      v-bind="$attrs"
      @input="$emit('input', $event.target.value)"
    />
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

@Component
export default class ImageInput extends Vue {
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
