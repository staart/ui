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
                  @select="option => (userCountryCode = option)"
                  size="is-medium"
                >
                  <template slot="empty">No results found</template>
                </b-autocomplete>
              </b-field>
            </div>
            <div class="column">
              <b-field label="Username">
                <b-input v-model="userUsername" size="is-medium"></b-input>
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
import Vue from "vue";
import { mapGetters } from "vuex";
import Component from "vue-class-component";
import ct from "countries-and-timezones";

const countries = ct.getAllCountries();

@Component
export default class OnboardingUser extends Vue {
  userName = "";
  userUsername = "";
  countrySearchQuery = "";
  userCountryCode = "us";
  countries = countries;

  created() {
    this.userName = this.$store.state.auth.user.details.name;
    this.userUsername = this.$store.state.auth.user.details.username;
    this.userCountryCode = this.$store.state.auth.user.details.countryCode;
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
