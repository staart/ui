<template>
  <div class="form-group">
    <label :for="labelId">
      <span>{{ label }}</span>
      <router-link
        v-if="labelHelp && labelHelpTo"
        :to="labelHelpTo"
        :aria-label="labelHelp"
        class="help-icon"
        data-balloon-pos="up"
      >
        <font-awesome-icon icon="question-circle" />
      </router-link>
    </label>
    <select
      :id="labelId"
      :value="value"
      :autocomplete="autocomplete"
      :required="required"
      @input="$emit('input', $event.target.value)"
    >
      <option v-if="placeholder" disabled>{{ placeholder }}</option>
      <option
        v-for="(option, index) in options"
        :key="`${labelId}_${index}`"
        :value="typeof index === 'string' ? index : option"
        >{{ option }}</option
      >
    </select>
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
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
library.add(faQuestionCircle);

@Component({
  components: {
    FontAwesomeIcon
  }
})
export default class Input extends Vue {
  @Prop() value;
  @Prop() label;
  @Prop() required;
  @Prop() placeholder;
  @Prop() help;
  @Prop() autocomplete;
  @Prop() options;
  @Prop() labelHelp;
  @Prop() labelHelpTo;
  @Prop() labelHelpHref;
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
  select {
    font: inherit;
    appearance: none;
    padding: 0.75rem;
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 0.2rem;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
    border: 1px solid rgba(121, 82, 179, 0.25);
    background-color: #fff;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(121, 82, 179, 0.25);
    }
  }
}
</style>
