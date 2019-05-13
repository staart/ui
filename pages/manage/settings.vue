<template>
  <main>
    <Manage>
      <h1>Settings</h1>
      <Loading v-if="loading" :message="loading" />
      <form v-else @submit.prevent="save">
        <Input
          :value="name"
          label="Name"
          placeholder="Enter your organization's name"
          required
          @input="val => (name = val)"
        />
        <Input
          :value="invitationDomain"
          label="Email domain"
          placeholder="Enter your company's domain"
          help="We'll allow people with emails from this domain to join this organization automatically"
          @input="val => (invitationDomain = val)"
        />
        <button class="button">
          Update settings
        </button>
      </form>
    </Manage>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Manage from "@/components/Manage.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import ImageInput from "@/components/form/Image.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";

@Component({
  components: {
    Manage,
    Loading,
    Input,
    Select,
    ImageInput,
    Checkbox
  },
  computed: mapGetters({
    organization: "auth/activeOrganization"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  loading = "";
  name = "";
  invitationDomain = "";

  private mounted() {
    this.loading = "Loading organization details";
    this.$store
      .dispatch("manage/getOrganization", this.organization.organization.id)
      .then(() => {
        this.name = this.$store.state.manage.organization.name;
        this.invitationDomain = this.$store.state.manage.organization.invitationDomain;
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private save() {
    this.loading = "Saving";
    this.$store
      .dispatch("manage/updateOrganization", {
        name: this.name,
        invitationDomain: this.invitationDomain
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
