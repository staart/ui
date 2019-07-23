<template>
  <div class="form-group">
    <label>
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
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@/components/form/Autocomplete.vue";
import en from "@/locales/en";
const months = en.months;
library.add(faCheck);

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
