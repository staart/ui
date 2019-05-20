<template>
  <timeago
    :title="safeValue"
    class="time-ago"
    :datetime="date"
    :auto-update="true"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class TimeAgo extends Vue {
  @Prop() date?: Date;

  get safeValue() {
    try {
      if (this.date) return new Date(this.date).toLocaleString();
    } catch (error) {}
    return "";
  }
}
</script>
