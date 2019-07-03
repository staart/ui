<template>
  <span>{{ en[t] }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import flat from "flat";
import en from "@/locales/en";

@Component
export default class Translate extends Vue {
  en = flat(en);
  @Prop({ required: true }) t;
}
</script>
