<template>
  <no-ssr>
    <span v-if="never">Never</span>
    <timeago
      v-else
      :title="safeValue"
      class="time-ago"
      :datetime="date"
      :auto-update="true"
    />
  </no-ssr>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class TimeAgo extends Vue {
  @Prop() date?: Date;

  get never() {
    if (!this.date) return false;
    if (new Date(this.date).getFullYear() > 2200) return true;
    return false;
  }

  get safeValue() {
    try {
      if (this.date) return new Date(this.date).toLocaleString();
    } catch (error) {}
    return "";
  }
}
</script>
