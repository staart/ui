<template>
  <main>
    <Settings>
      <h1>Account</h1>
      <Loading v-if="loading" :message="loading" />
      <form v-else>
        <Input
          :value="name"
          label="Name"
          placeholder="Enter your full name"
          required
          @input="val => (name = val)"
        />
        {{ name }}
        <Input
          :value="nickname"
          label="Nickname"
          placeholder="Enter a nickname"
          required
          @input="val => (nickname = val)"
        />
        <Select
          :value="countryCode"
          label="Country"
          placeholder="Select your country"
          :options="countries"
          required
          @input="val => (countryCode = val)"
        />
        <Select
          :value="preferredLanguage"
          label="Language"
          placeholder="Select your preferred language"
          :options="languages"
          required
          @input="val => (preferredLanguage = val)"
        />
        <Select
          :value="timezone"
          label="Timezone"
          placeholder="Select your preferred timezone"
          :options="timezones"
          required
          @input="val => (timezone = val)"
        />
        <Checkbox
          :value="prefersReducedMotion"
          label="Prefer reduced motion"
          @input="val => (prefersReducedMotion = val)"
        />
        {{ prefersReducedMotion }}
        <button type="submit" class="button button--color-primary">
          Update account settings
        </button>
      </form>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "../../types/auth";

@Component({
  components: {
    Settings,
    Loading,
    Input,
    Select,
    Checkbox
  },
  computed: mapGetters({
    user: "auth/user"
  })
})
export default class AccountSettings extends Vue {
  user!: User;
  loading = "";
  countries = {};
  languages = {
    "en-us": "English (United States)",
    "en-uk": "English (United Kingdom)"
  };

  name: string = "";
  nickname!: string;
  countryCode!: string;
  preferredLanguage!: string;
  prefersReducedMotion!: boolean;
  timezone!: string;

  private created() {
    const countries = {};
    const allCountries = getAllCountries();
    for (const country in allCountries) {
      if (allCountries.hasOwnProperty(country)) {
        countries[country.toLowerCase()] = allCountries[country].name;
      }
    }
    this.countries = countries;

    this.name = this.user.name;
    this.nickname = this.user.nickname;
    this.countryCode = this.user.countryCode;
    this.preferredLanguage = this.user.preferredLanguage;
    this.prefersReducedMotion = this.user.prefersReducedMotion;
    this.timezone = this.user.timezone;
  }

  get timezones() {
    return getAllCountries()[this.user.countryCode.toUpperCase()].timezones;
  }
}
</script>

<style lang="scss" scoped></style>
