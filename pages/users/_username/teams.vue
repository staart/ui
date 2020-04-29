<template>
  <div>
    <h1 class="is-size-4">Teams</h1>
    <b-table
      :loading="loading"
      :data="teams.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable label="Team name">
          {{ props.row.organization.name }}
        </b-table-column>
        <b-table-column sortable label="Role">
          {{ props.row.role }}
        </b-table-column>
        <b-table-column sortable label="Joined">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-button
            type="is-primary"
            tag="nuxt-link"
            :to="`/teams/${props.row.organization.username}`"
          >
            Go to team
          </b-button>
          <b-tooltip label="Delete">
            <b-button
              type="is-danger"
              icon-right="delete"
              @click="deleteTeam(props.row.id, props.row.organization.name)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Create another team</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Team name">
        <b-input type="team" v-model="newTeam" required />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loading">
        Create team
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "users",
})
export default class UsersTeams extends Vue {
  newTeam = "";
  loading = false;
  teams: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    const { data } = await this.$axios.get(
      `/users/${this.$route.params.username}/memberships`
    );
    this.teams = data;
    this.loading = false;
  }

  async add() {
    this.loading = true;
    const { data } = await this.$axios.put(
      `/users/${this.$route.params.username}/organizations`,
      {
        team: this.newTeam,
      }
    );
    this.teams.data.push(data.added);
    this.newTeam = "";
    this.loading = false;
  }

  async deleteTeam(id: number, team: string) {
    this.$buefy.dialog.confirm({
      title: "Leaving team",
      message: `Are you sure you want to leave the team <strong>${team}</strong>? This action is not reversible, and you'll have to request to join this team again if you change your mind.`,
      confirmText: "Yes, leave team",
      cancelText: "No, don't leave",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        await this.$axios.delete(
          `/users/${this.$route.params.username}/memberships/${id}`
        );
        return this.get();
      },
    });
  }
}
</script>
