<template>
  <div class="form-group">
    <label :for="labelId">{{ label }}</label>
    <input
      :id="labelId"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :min="min"
      :max="max"
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
export default class Input extends Vue {
  @Prop({ default: "text" }) type;
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() placeholder;
  @Prop() help;
  @Prop() autocomplete;
  @Prop() min;
  @Prop() max;
  labelId = "";

  private created() {
    this.labelId = Math.random()
      .toString(36)
      .substring(7);
  }
}
</script>
