<template>
  <div>
    <h1 class="is-size-4 mb-4">Account settings</h1>
    <form @submit.prevent="save">
      <b-field label="Name">
        <b-input type="text" v-model="user.name" required />
      </b-field>
      <div class="columns">
        <div class="column">
          <b-field label="Country">
            <b-autocomplete
              v-model="countrySearchQuery"
              :data="filteredCountriesArray"
              :keep-first="true"
              :open-on-focus="true"
              placeholder="e.g. United States"
              @select="country => (selectedCountryCode = country)"
            >
              <template slot="empty">No results found</template>
            </b-autocomplete>
          </b-field>
        </div>
        <div class="column">
          <b-field>
            <template slot="label">
              Timezone
              <b-tooltip
                type="is-dark"
                label="We need your timezone to show you local times"
              >
                <b-icon size="is-small" icon="help-circle-outline"></b-icon>
              </b-tooltip>
            </template>
            <b-select
              placeholder="Select a name"
              v-model="user.timezone"
              expanded
            >
              <option
                v-for="(timezone, i) in filteredTimezonesArray"
                :value="timezone"
                :key="`t${i}${timezone}`"
                >{{ timezone }}</option
              >
            </b-select>
          </b-field>
        </div>
      </div>
      <b-field label="Language">
        <b-select
          placeholder="Select a language"
          v-model="user.prefersLanguage"
          expanded
        >
          <option
            v-for="(language, i) in languages"
            :value="i"
            :key="`t${i}${language}`"
            >{{ language }}</option
          >
        </b-select>
      </b-field>
      <b-field>
        <template slot="label">
          Gender
          <b-tooltip
            type="is-dark"
            :label="
              user.gender === 'MALE'
                ? `We'll use him/his as your pronoun`
                : user.gender === 'FEMALE'
                ? `We'll use her/her as your pronoun`
                : `We'll use they/them as your pronoun`
            "
          >
            <b-icon size="is-small" icon="help-circle-outline"></b-icon>
          </b-tooltip>
        </template>
        <div>
          <b-radio name="radioGender" native-value="MALE" v-model="user.gender"
            >Male</b-radio
          >
          <b-radio
            name="radioGender"
            native-value="FEMALE"
            v-model="user.gender"
            >Female</b-radio
          >
          <b-radio
            name="radioGender"
            native-value="NONBINARY"
            v-model="user.gender"
            >Non-binary</b-radio
          >
          <b-radio
            name="radioGender"
            native-value="UNKNOWN"
            v-model="user.gender"
            >Prefer not to say</b-radio
          >
        </div>
      </b-field>
      <label class="label">Security</label>
      <b-field>
        <b-checkbox v-model="user.checkLocationOnLogin"
          >Verify my location when I login</b-checkbox
        >
      </b-field>
      <label class="label">Accessibility</label>
      <b-field>
        <b-checkbox
          v-model="user.prefersReducedMotion"
          true-value="REDUCE"
          false-value="REDUCE"
          >I prefer reduced motion</b-checkbox
        >
      </b-field>
      <label class="label">Webapp color scheme</label>
      <b-field>
        <b-radio
          name="radioColorScheme"
          native-value="NO_PREFERENCE"
          v-model="user.prefersColorScheme"
          >Use system settings</b-radio
        >
        <b-radio
          name="radioColorScheme"
          native-value="LIGHT"
          v-model="user.prefersColorScheme"
          >Light theme</b-radio
        >
        <b-radio
          name="radioColorScheme"
          native-value="DARK"
          v-model="user.prefersColorScheme"
          >Dark theme</b-radio
        >
      </b-field>
      <div>
        <b-button type="is-primary" native-type="submit"
          >Update settings</b-button
        >
      </div>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </form>
  </div>
</template>

<script lang="ts">
import ct from "countries-and-timezones";
import { mapGetters } from "vuex";
import { Vue, Component, Watch } from "vue-property-decorator";

const countries = ct.getAllCountries();

@Component({
  middleware: "authenticated",
  layout: "users"
})
export default class UsersProfile extends Vue {
  loading = false;
  user: any = {};

  countrySearchQuery = "";
  languages = {
    "en-us": "English (United States)",
    "en-in": "English (India)"
  };
  filteredTimezonesArray = ct.getTimezonesForCountry("US").map(i => i.name);

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data }: { data: any } = await this.$axios.get(
        `/users/${this.$route.params.id}`
      );
      this.user = data;
    } catch (error) {}
    this.loading = false;

    const country = ct.getCountry(
      (this.user.countryCode ?? "US").toLocaleUpperCase()
    );
    if (country) this.countrySearchQuery = country.name;
  }

  @Watch("selectedCountryCode")
  onCountryCodeChanged(value: string) {
    const countryCodes = Object.entries(countries).filter(
      i => i[1].name === value
    );
    if (countryCodes.length)
      this.user.countryCode = countryCodes[0][0].toLocaleLowerCase();
  }

  @Watch("countrySearchQuery")
  onCountrySearchQueryChanged(value: string) {
    const filteredCountries = Object.entries(countries).filter(
      i => i[1].name === value
    );
    if (filteredCountries.length)
      this.user.countryCode = filteredCountries[0][0].toLocaleLowerCase();
    this.filteredTimezonesArray = (
      ct.getTimezonesForCountry(this.user.countryCode.toLocaleUpperCase()) || []
    ).map(i => i.name);
    if (
      !this.filteredTimezonesArray.includes(this.user.timezone) &&
      this.filteredTimezonesArray.length
    ) {
      this.user.timezone = this.filteredTimezonesArray[0];
    }
  }

  get filteredCountriesArray() {
    return Object.values(countries)
      .filter(i =>
        i.name
          .toLocaleLowerCase()
          .includes(this.countrySearchQuery.toLocaleLowerCase())
      )
      .map(i => i.name);
  }

  async save() {
    const user = { ...this.user };
    [
      "createdAt",
      "id",
      "primaryEmail",
      "role",
      "twoFactorEnabled",
      "twoFactorSecret",
      "updatedAt"
    ].forEach(i => delete user[i]);
    this.loading = true;
    try {
      const { data } = await this.$axios.patch(
        `/users/${this.$route.params.id}`,
        user
      );
      this.user = data.updated;
    } catch (error) {}
    this.loading = false;

    const country = ct.getCountry(
      (this.user.countryCode ?? "US").toLocaleUpperCase()
    );
    if (country) this.countrySearchQuery = country.name;
  }
}
</script>
