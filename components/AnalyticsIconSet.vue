<template>
  <span>
    <Country v-if="countryCode" :code="countryCode" :show-text="false" />
    <IconText
      v-if="browser || userAgent"
      :text="getBrowserName(userAgent)"
      :show-text="false"
    />
    <IconText
      v-if="os || userAgent"
      :text="getOsName(userAgent)"
      :show-text="false"
    />
    <IconText
      v-if="manufacturer || userAgent"
      :text="getManufactererName(userAgent)"
      :show-text="false"
    />
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import WhichBrowser from "which-browser";
import Country from "@/components/Country.vue";
import IconText from "@/components/IconText.vue";

@Component({
  components: {
    Country,
    IconText
  }
})
export default class AnalyticsIconSet extends Vue {
  @Prop() countryCode;
  @Prop() userAgent;
  @Prop() manufacturer;
  @Prop() browser;
  @Prop() os;

  getBrowserName(userAgent) {
    if (this.browser) return this.browser;
    const result = new WhichBrowser(userAgent);
    return result.browser.name;
  }
  getManufactererName(userAgent) {
    if (this.manufacturer) return this.manufacturer;
    const result = new WhichBrowser(userAgent);
    return result.device.manufacturer;
  }
  getOsName(userAgent) {
    if (this.os) return this.os;
    const result = new WhichBrowser(userAgent);
    return result.os.name;
  }
}
</script>
