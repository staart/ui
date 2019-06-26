<template>
  <main>
    <div class="row">
      <h1>Settings</h1>
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
      <Input
        :value="organization.name"
        label="Name"
        placeholder="Enter your organization's name"
        required
        @input="val => (organization.name = val)"
      />
      <Input
        :value="organization.username"
        label="Username"
        placeholder="Enter a unique username"
        help="Changing your username can have unintended side effects"
        @input="val => (organization.username = val)"
      />
      <Input
        :value="organization.invitationDomain"
        label="Email domain"
        placeholder="Enter your company's domain, eg. oswaldlabs.com"
        help="We'll allow people with emails from this domain to join this organization automatically"
        @input="val => (organization.invitationDomain = val)"
      />
      <button class="button">
        Update settings
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { User } from "@/types/auth";
import {
  OrganizationsKV,
  Organization,
  emptyOrganization
} from "@/types/manage";
library.add(faSync);

@Component({
  components: {
    Loading,
    Input,
    FontAwesomeIcon,
    Select,
    ImageInput,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  loading = "";
  organization: Organization = emptyOrganization;

  private created() {
    this.organization = {
      ...this.$store.getters["manage/organization"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading organization details";
    this.$store
      .dispatch("manage/getOrganization", this.$route.params.team)
      .then(org => {
        this.organization = { ...org };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("manage/updateOrganization", {
        team: this.$route.params.team,
        ...this.organization
      })
      .then(() => {
        this.$router.replace(`/manage/${this.organization.username}/settings`);
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
