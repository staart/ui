<template>
  <div class="form-group">
    <label>
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
    <div class="row">
      <div>
        <label class="field-label">
          <span>Year</span>
          <input type="text" />
        </label>
      </div>
      <div>
        <label class="field-label">
          <span>Month</span>
          <Autocomplete :options="months" />
        </label>
      </div>
      <div>
        <label class="field-label">
          <span>Date</span>
          <input type="number" min="1" max="31" />
        </label>
      </div>
    </div>
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
import Autocomplete from "@/components/form/Autocomplete.vue";
import en from "@/locales/en";
const months = en.months;
library.add(faQuestionCircle);

@Component({
  components: {
    FontAwesomeIcon,
    Autocomplete
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
  months = months;
}
</script>

<style lang="scss" scoped></style>
