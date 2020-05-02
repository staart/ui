<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Teams</h1>
    <b-table
      :loading="loading"
      :data="teams.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column sortable field="stripeCustomerId" label="Stripe ID">
          <code v-if="props.row.stripeCustomerId">
            {{ props.row.stripeCustomerId }}
          </code>
          <span v-else><em>None</em></span>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Created">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-button
            type="is-primary"
            tag="nuxt-link"
            :to="`/teams/${props.row.username}`"
          >
            Go to team
          </b-button>
        </b-table-column>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="teams.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more teams
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "admin",
})
export default class AdminTeams extends Vue {
  loading = false;
  teams: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/admin/organizations?first=10&orderBy=id:desc${
          this.teams.data.length
            ? `&after=${this.teams.data[this.teams.data.length - 1].id}`
            : ""
        }`
      );
      this.teams.data.push(...(data.data || []));
      this.teams.hasMore = data.hasMore;
      this.teams = data;
    } catch (error) {}
    this.loading = false;
  }
}
</script>
