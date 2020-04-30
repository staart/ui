<template>
  <div>
    <h1 class="is-size-4">Team settings</h1>
    <form @submit.prevent="save" style="margin-top: 1rem">
      <b-field label="Name">
        <b-input type="text" v-model="team.name" required />
      </b-field>
      <b-field label="Username">
        <b-input type="text" v-model="team.username" required />
      </b-field>
      <h1 class="is-size-5" style="margin: 1rem 0">Security settings</h1>
      <b-field label="IP address restrictions">
        <b-taginput
          v-model="ipRestrictions"
          icon="ip-network"
          placeholder="Add an IP CIDR"
        >
        </b-taginput>
      </b-field>
      <b-field>
        <b-checkbox v-model="team.forceTwoFactor">
          Force team members to enable two-factor authentication
        </b-checkbox>
      </b-field>
      <div style="margin-top: 1rem">
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Update team settings
        </b-button>
      </div>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersProfile extends Vue {
  loading = false;
  loadingSave = false;
  team: any = {};
  ipRestrictions: string[] = [];

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}`
      );
      this.team = data;
      if (this.team.ipRestrictions)
        this.ipRestrictions = (this.team.ipRestrictions || [])
          .split(",")
          .map((i: string) => i.trim());
    } catch (error) {}
    this.loading = false;
  }

  async save() {
    this.loadingSave = true;
    try {
      const { data } = await this.$axios.patch(
        `/organizations/${this.$route.params.username}`,
        {
          name: this.team.name,
          username: this.team.username,
          ipRestrictions: this.ipRestrictions.join(", ") || undefined,
          forceTwoFactor: this.team.forceTwoFactor,
        }
      );
      this.team = data.updated;
    } catch (error) {}
    this.loadingSave = false;
  }
}
</script>
