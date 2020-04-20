<template>
  <div class="container">
    <b-steps :value="2" :has-navigation="false">
      <b-step-item label="Profile" :clickable="true">
        <h1 class="title has-text-centered">Set up your account</h1>
        <form @submit.prevent="goToNextStep">
          <b-field label="Name">
            <b-input v-model="userName" size="is-medium" />
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
          <b-button
            type="is-primary"
            native-type="submit"
            size="is-medium"
            :loading="loading"
            >Save and continue</b-button
          >
        </form>
      </b-step-item>
      <b-step-item label="Security" :clickable="true">
        <h1 class="title has-text-centered">Select your security settings</h1>
        <form @submit.prevent="goToNextStep">
          <b-field label="Security preset">
            <b-slider
              :min="0"
              :max="2"
              class="security-preset"
              aria-label="Security preset"
              :tooltip="false"
              v-model="securityPreset"
              rounded
            >
              <b-slider-tick :value="0">Most open</b-slider-tick>
              <b-slider-tick :value="1">Balanced</b-slider-tick>
              <b-slider-tick :value="2">Most secure</b-slider-tick>
            </b-slider>
          </b-field>
          <div style="margin: 3.5rem 0 2rem 0">
            <div v-if="securityPreset === 0">
              <h3 class="is-size-5">Most open</h3>
              <ul>
                <li>We won't verify your logins based on your location</li>
                <li>We'll log you in for up to 365 days</li>
                <li>
                  You'll receive security emails and updates
                </li>
                <li>
                  You won't have to re-enter your password for secure actions
                </li>
                <li>You can download or delete your data at any time</li>
              </ul>
            </div>
            <div v-else-if="securityPreset === 1">
              <h3 class="is-size-5">Balanced</h3>
              <ul>
                <li>We won't verify your logins based on your location</li>
                <li>We'll log you in for up to 30 days</li>
                <li>
                  You'll receive account and security emails, no promotions
                </li>
                <li>
                  You'll have to re-enter your password for secure actions
                </li>
                <li>You can download or delete your data at any time</li>
              </ul>
            </div>
            <div v-else>
              <h3 class="is-size-5">Most secure</h3>
              <ul>
                <li>We'll verify your logins based on your location</li>
                <li>We'll log you in for up to 7 days</li>
                <li>
                  You'll receive only security emails
                </li>
                <li>
                  You'll have to re-enter your password for secure actions
                </li>
                <li>You can download or delete your data at any time</li>
              </ul>
            </div>
          </div>
          <h2 class="is-size-4" style="margin-bottom: 0.5rem">
            Two-factor authentication
          </h2>
          <p>
            2FA adds an additional layer of protection in your account. You'll
            need to have a TOTP app like Google Authenticator or a password
            manager like 1Password to use 2FA.
          </p>
          <div class="buttons" style="margin-top: 1rem">
            <b-button type="is-success" size="is-medium" :loading="loading"
              >Enable 2FA</b-button
            >
          </div>
          <b-button
            type="is-primary"
            native-type="submit"
            size="is-medium"
            :loading="loading"
            >Save and continue</b-button
          >
        </form>
      </b-step-item>
      <b-step-item label="Team" :clickable="true">
        <h1 class="title has-text-centered">Do you have a team?</h1>
        <div class="columns has-text-centered">
          <div class="column">
            <div class="is-size-1">🏢</div>
            <h2 class="is-size-4" style="margin-bottom: 0.5rem">
              Yes, I have a team
            </h2>
            <p style="margin-bottom: 1rem">
              You can invite your team members in the next step.
            </p>
            <b-field label="Team name">
              <b-input v-model="teamName" size="is-medium" />
            </b-field>
            <b-button
              type="is-primary"
              native-type="submit"
              size="is-medium"
              :loading="loading"
              >Setup team account</b-button
            >
          </div>
          <div class="column">
            <div class="is-size-1">👩‍🚀</div>
            <h2 class="is-size-4" style="margin-bottom: 0.5rem">
              No, I'm flying solo
            </h2>
            <p style="margin-bottom: 1rem">
              You can still add team members later as you grow.
            </p>
            <b-button native-type="submit" size="is-medium" :loading="loading"
              >Setup individual account</b-button
            >
          </div>
        </div>
      </b-step-item>
    </b-steps>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import axios from "axios";
import ct from "countries-and-timezones";

const countries = ct.getAllCountries();

@Component
export default class OnboardingUser extends Vue {
  userName = "";
  userUsername = "";
  userCountryCode = "us";
  userTimezone = "America/Los_Angeles";

  loading = false;
  countrySearchQuery = "United States";
  filteredTimezonesArray = ct.getTimezonesForCountry("US").map(i => i.name);
  securityPreset = 1;

  created() {
    this.userName = this.$store.state.auth.user.details.name;
    this.userUsername = this.$store.state.auth.user.details.username;
    this.userCountryCode = this.$store.state.auth.user.details.countryCode;
  }

  async mounted() {
    try {
      const { data } = await axios.get<{
        timezone?: string;
        country?: string;
      }>("https://ipinfo.io/json");
      this.userCountryCode = (data.country ?? "US").toLocaleLowerCase();
      this.userTimezone = data.timezone ?? "America/Los_Angeles";
      if (data.country) {
        const country = ct.getCountry(data.country.toLocaleLowerCase());
        if (country) this.countrySearchQuery = country.name;
      }
    } catch (error) {}
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

  get teamName() {
    return `${this.userName.split(" ")[0]}'s Team`;
  }

  async goToNextStep() {
    const checkLocationOnLogin = this.securityPreset === 2;
    const notificationEmails =
      this.securityPreset === 0
        ? "ACCOUNT"
        : this.securityPreset === 1
        ? "UPDATES"
        : "PROMOTIONS";
    console.log({ checkLocationOnLogin, notificationEmails });
    console.log({
      name: this.userName,
      username: this.userUsername,
      countryCode: this.userCountryCode ? this.userCountryCode : undefined,
      timezone: this.userTimezone
    });
  }
}
</script>

<style scoped>
.container {
  margin: 2.5vw auto 5vw auto;
  max-width: 600px;
}
h1 {
  margin-top: 2.5vw;
}
li {
  list-style-type: circle;
  margin-left: 1.75rem;
}
</style>

<style>
.security-preset .b-slider-tick-label {
  margin-top: 1rem;
}
</style>
