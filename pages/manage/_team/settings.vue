<template>
  <main>
    <h1>Settings</h1>
    <Loading v-if="loading" :message="loading" />
    <form v-else @submit.prevent="save">
      <Input
        :value="organization.name"
        label="Name"
        placeholder="Enter your organization's name"
        required
        @input="val => (organization.name = val)"
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
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import {
  OrganizationsKV,
  Organization,
  emptyOrganization
} from "../../../types/manage";

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
export default class ManageSettings extends Vue {
  loading = "";
  organization: Organization = emptyOrganization;

  private created() {
    this.organization = {
      ...this.$store.getters["manage/organization"](this.$route.params.team)
    };
  }

  private mounted() {
    this.loading = "Loading organization details";
    this.$store
      .dispatch("manage/getOrganization", this.$route.params.team)
      .then(org => {
        this.organization = { ...org };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("manage/updateOrganization", {
        team: this.$route.params.team,
        name: this.organization.name,
        invitationDomain: this.organization.invitationDomain
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
