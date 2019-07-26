<template>
  <div class="form-group">
    <label>
      <input
        :checked="value"
        type="checkbox"
        :required="required"
        :disabled="disabled"
        @change="$emit('input', $event.target.checked)"
      />
      <span>{{ label }}</span>
      <span
        v-if="help && questionMark"
        :aria-label="help"
        class="help-icon"
        data-balloon-pos="up"
      >
        <font-awesome-icon icon="question-circle" />
      </span>
    </label>
    <div
      v-if="help && !questionMark"
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
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
library.add(faQuestionCircle);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Checkbox extends Vue {
  @Prop({ default: "text" }) type;
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() disabled;
  @Prop() placeholder;
  @Prop() help;
  @Prop({ default: false }) questionMark;
  @Prop() autocomplete;
  labelId = Math.random()
    .toString(36)
    .substring(7);
}
</script>

<style lang="scss" scoped>
input,
label span {
  display: inline-block;
  width: auto;
}
</style>
