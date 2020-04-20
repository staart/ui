<template>
  <div class="container">
    <b-steps :value="0" :has-navigation="false">
      <b-step-item label="Profile" :clickable="true">
        <h1 class="title has-text-centered">Set up your account</h1>
        <form>
          <b-field label="Name">
            <b-input v-model="userName" size="is-medium"></b-input>
          </b-field>
          <div class="columns">
            <div class="column">
              <b-field label="Country">
                <b-autocomplete
                  v-model="countrySearchQuery"
                  :data="filteredCountriesArray"
                  placeholder="e.g. United States"
                  @select="country => (userCountryCode = country)"
                  size="is-medium"
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
                  v-model="userTimezone"
                  size="is-medium"
                  expanded
                >
                  <option
                    v-for="(timezone, i) in filteredTimezonesArray"
                    :value="timezone"
                    :key="`t${i}${timezone}`"
                  >
                    {{ timezone }}
                  </option>
                </b-select>
              </b-field>
            </div>
          </div>
        </form>
      </b-step-item>
      <b-step-item label="Team" :clickable="true">
        <h1 class="title has-text-centered">Profile</h1>
        User's settings
      </b-step-item>
      <b-step-item label="Product" :clickable="true">
        <h1 class="title has-text-centered">Profile</h1>
        User's settings
      </b-step-item>
    </b-steps>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import ct from "countries-and-timezones";

const countries = ct.getAllCountries();

@Component
export default class OnboardingUser extends Vue {
  userName = "";
  userUsername = "";
  userCountryCode = "us";
  userTimezone = "America/Los_Angeles";

  countrySearchQuery = "";
  filteredTimezonesArray = ["America/Los_Angeles"];

  created() {
    this.userName = this.$store.state.auth.user.details.name;
    this.userUsername = this.$store.state.auth.user.details.username;
    this.userCountryCode = this.$store.state.auth.user.details.countryCode;
  }

  @Watch("countrySearchQuery")
  onCountrySearchQueryChanged(value: string) {
    const filteredCountries = Object.entries(countries).filter(
      i => i[1].name === value
    );
    if (filteredCountries.length)
      this.userCountryCode = filteredCountries[0][0];
    this.filteredTimezonesArray = (
      ct.getTimezonesForCountry(this.userCountryCode) || []
    ).map(i => i.name);
    if (this.filteredTimezonesArray.length)
      this.userTimezone = this.filteredTimezonesArray[0];
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
}
</script>

<style scoped>
form {
  margin: 2.5vw auto 5vw auto;
  max-width: 600px;
}
h1 {
  margin-top: 5vw;
}
</style>
