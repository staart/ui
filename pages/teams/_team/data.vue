<template>
  <Loading v-if="loading" :message="loading" />
  <main v-else>
    <div class="row">
      <h2>Security settings</h2>
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
    <form v-meta-ctrl-enter="save" @submit.prevent="save">
      <CommaList
        label="IP restrictions"
        :value="organization.ipRestrictions"
        placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
        @input="val => (organization.ipRestrictions = val)"
      />
      <Checkbox
        :value="organization.forceTwoFactor"
        label="Enforce two-factor authorization (2FA) on team members"
        @input="val => (organization.forceTwoFactor = val)"
      />
      <button class="button">
        Update security settings
      </button>
    </form>
    <h2>Export data</h2>
    <p>
      You can download an export of your data in JSON format. This will help you
      keep track of what we have and transfer your settings to other apps.
    </p>
    <form @submit.prevent="exportData">
      <button class="button">
        Export all data
      </button>
    </form>
    <h2>Delete team</h2>
    <p>
      You can delete your team account. Note that this action is not reversible,
      and all your data will be permanently lost. If you ever change your mind,
      you'll have to create a new team and invite all members again.
    </p>
    <form @submit.prevent="showDelete = true">
      <button class="button button--color-danger">
        Delete team
      </button>
    </form>
    <h2>Data Protection Officer</h2>
    <p>
      If you have any questions or concerns about your data or our security
      measures, you can get in touch with our Data Protection Officer.
    </p>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>Are you sure you want to delete {{ organization.name }}?</h2>
        <p>
          Deleting a team is not reversible, and all members will be removed.
        </p>
        <form @submit.prevent="deleteOrganization">
          <Input
            :value="deleteText"
            label='To confirm, enter "delete team" below'
            placeholder="Write those exact words"
            required
            @input="val => (deleteText = val)"
          />
          <button class="button button--color-danger button--state-cta">
            Yes, delete team
          </button>
          <button type="button" class="button" @click="showDelete = false">
            No, don't delete
          </button>
        </form>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import Confirm from "@/components/Confirm.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import CommaList from "@/components/form/CommaList.vue";
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
    Confirm,
    Input,
    CommaList,
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
  showDelete = false;
  deleteText = "";

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
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private exportData() {
    this.loading = "Exporting your data";
    this.$store
      .dispatch("manage/getExport", { team: this.$route.params.team })
      .then(() => {})
      .catch(() => {})
      .then(() => (this.loading = ""));
  }

  private deleteOrganization() {
    if (this.deleteText !== "delete team") return;
    this.showDelete = false;
    this.loading = "Deleting your team";
    this.$store
      .dispatch("manage/deleteOrganization", { team: this.$route.params.team })
      .then(() => {
        this.$router.push("/settings/organizations");
      })
      .catch(error => {
        throw new Error(error);
      })
      .then(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
