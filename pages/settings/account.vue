<template>
  <main>
    <Settings>
      <h1>Account</h1>
      <Loading v-if="loading" :message="loading" />
      <form v-else @submit.prevent="save">
        <Input
          :value="name"
          label="Name"
          placeholder="Enter your full name"
          required
          @input="val => (name = val)"
        />
        <Input
          :value="nickname"
          label="Nickname"
          placeholder="Enter a nickname"
          required
          @input="val => (nickname = val)"
        />
        <Select
          :value="gender"
          label="Gender"
          placeholder="Select your preferred gender"
          :options="genders"
          required
          @input="val => (gender = val)"
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
          label="I prefer reduced motion (minimize animations and movement)"
          @input="val => (prefersReducedMotion = val)"
        />
        <button type="submit" class="button button--color-primary">
          Update account settings
        </button>
      </form>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
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
  }
})
export default class AccountSettings extends Vue {
  loading = "";
  countries = {};
  languages = {
    "en-us": "English (United States)",
    "en-uk": "English (United Kingdom)"
  };
  genders = {
    m: "Male (him)",
    f: "Female (her)",
    n: "Non-binary (their)",
    x: "Prefer not to say (their)"
  };
  timezones = ["Europe/Amsterdam"];

  name: string = "";
  nickname: string = "";
  countryCode: string = "";
  preferredLanguage: string = "";
  prefersReducedMotion: boolean = false;
  timezone: string = "";
  gender: string = "x";

  private created() {
    const countries = {};
    const allCountries = getAllCountries();
    for (const country in allCountries) {
      if (allCountries.hasOwnProperty(country)) {
        countries[country.toLowerCase()] = allCountries[country].name;
      }
    }
    this.countries = countries;
  }

  @Watch("countryCode")
  onCountryCodeChanged() {
    this.timezones = getAllCountries()[
      this.countryCode.toUpperCase()
    ].timezones;
    if (!this.timezones.includes(this.timezone)) {
      this.timezone = this.timezones[0];
    }
  }

  private mounted() {
    this.loading = "Loading account details";
    this.$store.dispatch("settings/getUser").then(() => {
      this.loading = "";
      this.name = this.$store.state.settings.user.name;
      this.nickname = this.$store.state.settings.user.nickname;
      this.countryCode = this.$store.state.settings.user.countryCode;
      this.preferredLanguage = this.$store.state.settings.user.preferredLanguage;
      this.prefersReducedMotion = this.$store.state.settings.user.prefersReducedMotion;
      this.timezone = this.$store.state.settings.user.timezone;
      this.gender = this.$store.state.settings.user.gender;
    });
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("settings/updateUser", {
        name: this.name,
        nickname: this.nickname,
        countryCode: this.countryCode,
        preferredLanguage: this.preferredLanguage,
        prefersReducedMotion: this.prefersReducedMotion,
        timezone: this.timezone,
        gender: this.gender
      })
      .then(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
