<template>
  <div>
    <label :for="labelId">{{ label }}</label>
    <input
      :id="labelId"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Input extends Vue {
  @Prop({ default: "text" }) type;
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() placeholder;
  @Prop() autocomplete;
  labelId = Math.random()
    .toString(36)
    .substring(7);
}
</script>
