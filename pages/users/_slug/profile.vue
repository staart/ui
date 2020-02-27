<template>
  <main>
    <div class="row">
      <h1>Account settings</h1>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            title="Refresh"
            class="icon"
            icon="sync"
            fixed-width
          />
        </button>
      </div>
    </div>
    <Loading v-if="loading" :message="loading" />
    <form v-else v-meta-ctrl-enter="save" @submit.prevent="save">
      <div class="row">
        <div
          class="profile-picture column column--type-shrink text text--align-center text--mr-2 text--mb-1"
        >
          <img alt="" :src="user.profilePicture" />
          <a href="https://gravatar.com" target="_blank">Gravatar</a>
        </div>
        <div>
          <Input
            :value="user.name"
            label="Full name"
            placeholder="Enter your full name"
            required
            @input="val => (user.name = val)"
          />
        </div>
      </div>
      <Input
        :value="user.nickname"
        label="Nickname"
        placeholder="Enter a nickname we should call you"
        required
        @input="val => (user.name = val)"
      />
      <Input
        :value="user.username"
        label="Username"
        placeholder="Enter a unique username"
        required
        @input="val => (user.username = val)"
      />
      <Select
        :value="user.gender"
        label="Gender"
        placeholder="Select the gender you most identify with"
        :options="genders"
        required
        @input="val => (user.gender = val)"
      />
      <div class="row">
        <Select
          :value="user.countryCode"
          label="Country"
          placeholder="Select your country"
          :options="countries"
          required
          @input="val => (user.countryCode = val)"
        />
        <Select
          :value="user.timezone"
          label="Timezone"
          placeholder="Select your timezone"
          :options="listTimeZones"
          required
          @input="val => (user.timezone = val)"
        />
      </div>
      <Select
        :value="user.preferredLanguage"
        label="Language"
        placeholder="Select your preferred language"
        :options="{
          'en-us': 'English (US)'
        }"
        required
        @input="val => (user.preferredLanguage = val)"
      />
      <Checkbox
        :value="user.prefersReducedMotion"
        label="I prefer reduced motion (minimize animations and movement)"
        @input="val => (user.prefersReducedMotion = val)"
      />
      <Checkbox
        :value="user.prefersColorSchemeDark"
        label="I prefer a dark color scheme"
        @input="val => (user.prefersColorSchemeDark = val)"
      />
      <button class="button">
        Update profile
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import {
  getAllCountries,
  getTimezonesForCountry
} from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { UsersKV, User, emptyUser } from "@/types/users";
import en from "@/locales/en";
const genders = en.genders;
library.add(faSync);
const countries = {};
const allCountries = getAllCountries();
for (const country in allCountries) {
  const cc = country.toLowerCase();
  countries[cc] = allCountries[country].name;
}

@Component({
  components: {
    Loading,
    Input,
    Autocomplete,
    FontAwesomeIcon,
    Select,
    ImageInput,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  loading = "";
  user: User = emptyUser;
  genders = genders;
  countries = countries;

  private created() {
    this.user = {
      ...this.$store.getters["users/user"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading user details";
    this.$store
      .dispatch("users/getUser", this.$route.params.slug)
      .then(user => {
        this.user = { ...user };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private save() {
    this.loading = "Saving";
    const user = { ...this.user };
    delete user.role;
    this.$store
      .dispatch("users/updateUser", {
        slug: this.$route.params.slug,
        ...user
      })
      .then(user => {
        this.user = { ...user };
        this.$router.replace(`/users/${this.user.username}/profile`);
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  get listTimeZones() {
    try {
      return getAllCountries()[(this.user.countryCode || "US").toUpperCase()]
        .timezones;
    } catch (error) {
      return [];
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-picture img {
  border-radius: 100%;
  width: 4rem;
  height: 4rem;
}
</style>
