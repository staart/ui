<template>
  <main>
    <h2>Profile</h2>
    <Loading v-if="loading" :message="loading" />
    <form v-else v-meta-ctrl-enter="save" @submit.prevent="save">
      <Input
        :value="name"
        label="Name"
        placeholder="Enter your full name"
        required
        @input="val => (name = val)"
      />
      <!-- <ImageInput
          :value="profilePicture"
          label="Profile picture"
          required
          @input="val => (profilePicture = val)"
        /> -->
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
        placeholder="Select the gender you most identify with"
        :options="genders"
        required
        @input="val => (gender = val)"
      />
      <button class="button">
        Update profile
      </button>
      <h2>Location</h2>
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
      <button class="button">
        Update location settings
      </button>
      <h2>Accessibility</h2>
      <Checkbox
        :value="prefersReducedMotion"
        label="I prefer reduced motion (minimize animations and movement)"
        @input="val => (prefersReducedMotion = val)"
      />
      <Checkbox
        :value="prefersColorSchemeDark"
        label="I prefer a dark color scheme"
        @input="val => (prefersColorSchemeDark = val)"
      />
      <button class="button">
        Update accessibility settings
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getAllCountries } from "countries-and-timezones";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { User } from "@/types/auth";
const countries = {};
const allCountries = getAllCountries();
for (const country in allCountries) {
  if (allCountries.hasOwnProperty(country)) {
    countries[country.toLowerCase()] = allCountries[country].name;
  }
}

@Component({
  components: {
    Loading,
    Input,
    Select,
    ImageInput,
    Checkbox
  },
  middleware: "auth"
})
export default class AccountSettings extends Vue {
  loading = "";
  countries = countries;
  languages = {
    "en-us": "English (United States)",
    "en-uk": "English (United Kingdom)"
  };
  genders = {
    m: "Male (he/him)",
    f: "Female (she/her)",
    n: "Non-binary (them/their)",
    x: "Prefer not to say (them/their)"
  };
  timezones = ["Europe/Amsterdam"];

  name = "";
  nickname = "";
  countryCode = "";
  preferredLanguage = "";
  profilePicture = "";
  prefersReducedMotion = false;
  prefersColorSchemeDark = false;
  timezone = "";
  gender = "x";

  @Watch("countryCode")
  onCountryCodeChanged() {
    this.timezones = getAllCountries()[
      this.countryCode.toUpperCase()
    ].timezones.map(t => t.replace(/_/g, " "));
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
      this.prefersColorSchemeDark = this.$store.state.settings.user.prefersColorSchemeDark;
      this.timezone = this.$store.state.settings.user.timezone;
      this.gender = this.$store.state.settings.user.gender;
      this.profilePicture = this.$store.state.settings.user.profilePicture;
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
        prefersColorSchemeDark: this.prefersColorSchemeDark,
        timezone: this.timezone,
        profilePicture: this.profilePicture,
        gender: this.gender
      })
      .then(() => this.$store.dispatch("auth/refresh"))
      .catch(() => {})
      .then(() => {
        this.loading = "";
      });
  }
}
</script>

<style lang="scss" scoped></style>
