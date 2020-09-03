<template>
  <div class="container">
    <b-steps v-model="value" :has-navigation="false">
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
                  @select="country => (selectedCountryCode = country)"
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
                    >{{ timezone }}</option
                  >
                </b-select>
              </b-field>
            </div>
          </div>
          <b-field>
            <template slot="label">
              Gender
              <b-tooltip
                type="is-dark"
                :label="
                  userGender === 'MALE'
                    ? `We'll use him/his as your pronoun`
                    : userGender === 'FEMALE'
                    ? `We'll use her/her as your pronoun`
                    : `We'll use they/them as your pronoun`
                "
              >
                <b-icon size="is-small" icon="help-circle-outline"></b-icon>
              </b-tooltip>
            </template>
            <div>
              <b-radio
                name="radioGender"
                native-value="MALE"
                v-model="userGender"
                >Male</b-radio
              >
              <b-radio
                name="radioGender"
                native-value="FEMALE"
                v-model="userGender"
                >Female</b-radio
              >
              <b-radio
                name="radioGender"
                native-value="NONBINARY"
                v-model="userGender"
                >Non-binary</b-radio
              >
              <b-radio
                name="radioGender"
                native-value="UNKNOWN"
                v-model="userGender"
                >Prefer not to say</b-radio
              >
            </div>
          </b-field>
          <div>
            Accessibility
          </div>
          <b-field>
            <b-checkbox
              v-model="userPrefersReducedMotion"
              true-value="REDUCE"
              false-value="REDUCE"
              >I prefer reduced motion</b-checkbox
            >
          </b-field>
          <div>
            Webapp color scheme
          </div>
          <b-field>
            <b-radio
              name="radioColorScheme"
              native-value="NO_PREFERENCE"
              v-model="userPrefersColorScheme"
              >Use system settings</b-radio
            >
            <b-radio
              name="radioColorScheme"
              native-value="LIGHT"
              v-model="userPrefersColorScheme"
              >Light theme</b-radio
            >
            <b-radio
              name="radioColorScheme"
              native-value="DARK"
              v-model="userPrefersColorScheme"
              >Dark theme</b-radio
            >
          </b-field>
          <div class="buttons">
            <b-button
              type="is-primary"
              native-type="submit"
              size="is-medium"
              :loading="loading"
              >Save and continue</b-button
            >
          </div>
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
          <div>
            <div v-if="securityPreset === 0">
              <h3 class="is-size-5">Most open</h3>
              <ul>
                <li>We won't verify your logins based on your location</li>
                <li>We'll log you in for up to 365 days</li>
                <li>You'll receive security emails and updates</li>
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
                <li>You'll receive only security emails</li>
                <li>
                  You'll have to re-enter your password for secure actions
                </li>
                <li>You can download or delete your data at any time</li>
              </ul>
            </div>
          </div>
          <h2 class="is-size-4 mb-4">
            Two-factor authentication
          </h2>
          <p>
            2FA adds an additional layer of protection in your account. You'll
            need to have a TOTP app like Google Authenticator or a password
            manager like 1Password to use 2FA.
          </p>
          <div class="buttons">
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
        <form @submit.prevent="goToNextStep" class="columns has-text-centered">
          <div class="column">
            <div class="is-size-1">🏢</div>
            <h2 class="is-size-4 mb-4">
              Yes, I have a team
            </h2>
            <p>
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
            <h2 class="is-size-4 mb-4">
              No, I'm flying solo
            </h2>
            <p>
              You can still add team members later as you grow.
            </p>
            <b-button native-type="submit" size="is-medium" :loading="loading"
              >Setup individual account</b-button
            >
          </div>
        </form>
      </b-step-item>
    </b-steps>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import axios from "axios";
import ct from "countries-and-timezones";

const countries = ct.getAllCountries();

@Component({
  middleware: "authenticated"
})
export default class OnboardingUser extends Vue {
  id = 0;
  userName = "";
  userCountryCode = "us";
  userPrefersColorScheme = "NO_PREFERENCE";
  userPrefersReducedMotion = "NO_PREFERENCE";
  userGender = "UNKNOWN";
  userTimezone = "America/Los_Angeles";

  value = 0;
  loading = false;
  countrySearchQuery = "";
  filteredTimezonesArray = ct.getTimezonesForCountry("US").map(i => i.name);
  securityPreset = 1;

  created() {
    this.id = this.$store.state.auth.user.details.id;
    this.userName = this.$store.state.auth.user.details.name;
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
        const country = ct.getCountry(data.country.toLocaleUpperCase());
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
      this.userCountryCode = filteredCountries[0][0].toLocaleLowerCase();
    this.filteredTimezonesArray = (
      ct.getTimezonesForCountry(this.userCountryCode.toLocaleUpperCase()) || []
    ).map(i => i.name);
    if (
      !this.filteredTimezonesArray.includes(this.userTimezone) &&
      this.filteredTimezonesArray.length
    ) {
      this.userTimezone = this.filteredTimezonesArray[0];
    }
  }

  @Watch("selectedCountryCode")
  onCountryCodeChanged(value: string) {
    const countryCodes = Object.entries(countries).filter(
      i => i[1].name === value
    );
    if (countryCodes.length)
      this.userCountryCode = countryCodes[0][0].toLocaleLowerCase();
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
    return `${(this.userName || "").split(" ")[0]}'s Team`;
  }

  async goToNextStep() {
    const checkLocationOnLogin = this.securityPreset === 2;
    const notificationEmails =
      this.securityPreset === 0
        ? "ACCOUNT"
        : this.securityPreset === 1
        ? "UPDATES"
        : "PROMOTIONS";
    if (this.value < 3) {
      this.loading = true;
      if (this.value === 2) {
        try {
          const { data } = await this.$axios.put("/groups", {
            name: this.teamName || this.userName
          });
          const memberships = (await this.$axios.get("/users/me/memberships"))
            .data;
          this.$store.commit("auth/setUserDetails", { memberships });
          return this.$router.push(`/teams/${data.added.id}`);
        } catch (error) {
          return this.$router.push("/");
        }
      } else {
        try {
          await this.$axios.patch(
            "/users/me",
            this.value === 0
              ? {
                  name: this.userName,
                  countryCode: this.userCountryCode
                    ? this.userCountryCode
                    : undefined,
                  timezone: this.userTimezone,
                  gender: this.userGender,
                  prefersColorScheme: this.userPrefersColorScheme,
                  prefersReducedMotion: this.userPrefersReducedMotion
                    ? "REDUCE"
                    : "NO_PREFERENCE"
                }
              : { checkLocationOnLogin, notificationEmails }
          );
        } catch (error) {}
      }
      this.loading = false;
      this.value += 1;
    }
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
