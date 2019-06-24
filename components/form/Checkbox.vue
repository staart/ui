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
      <div
        class="fake-checkbox"
        role="checkbox"
        :aria-checked="value"
        tabindex="0"
      >
        <font-awesome-icon class="icon icon--type-check" icon="check" />
      </div>
      <span>{{ label }}</span>
      <span
        v-if="help && questionMark"
        :aria-label="help"
        class="label-help"
        data-balloon-pos="up"
      >
        <span aria-hidden="true">?</span>
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
import { faCheck } from "@fortawesome/free-solid-svg-icons";
library.add(faCheck);

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
.form-group {
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    display: none;
  }
}
.fake-checkbox {
  outline: none;
  transition: 0.2s;
  background-color: #fff;
  box-shadow: rgba(42, 47, 69, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(42, 47, 69, 0.12) 0px 2px 5px 0px;
  &:focus {
    box-shadow: rgba(73, 34, 87, 0.46) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.42) 0px 1px 1px 0px,
      rgba(73, 34, 87, 0.42) 0px 2px 5px 0px, 0 0 0 3px rgba(121, 82, 179, 0.25);
  }
  border-radius: 0.2rem;
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.5rem;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin-top: 0.1rem;
}
.icon--type-check {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  color: #492257;
}
input:checked + .fake-checkbox {
  .icon--type-check {
    opacity: 1;
  }
}
input:disabled + .fake-checkbox {
  opacity: 0.3;
}
</style>
