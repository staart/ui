<template>
  <div>
    <h1 class="is-size-4">Sessions</h1>
    <b-table
      :loading="loading"
      :data="sessions.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable label="Session">{{ sessionName(props.row) }}</b-table-column>
        <b-table-column
          sortable
          field="createdAt"
          label="Logged in"
        >{{ new Date(props.row.createdAt).toLocaleString() }}</b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Logout">
            <b-button
              type="is-danger"
              icon-right="logout-variant"
              @click="deleteSession(props.row.id)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "users"
})
export default class UsersSessions extends Vue {
  loading = false;
  sessions: any = { data: [] };

  async created() {
    return this.get();
  }

  sessionName(session: { city?: string; region?: string }) {
    return `Chrome 13${session.city ? ` in ${session.city}` : ""}`;
  }

  async get() {
    this.loading = true;
    const { data }: { data: any } = await this.$axios.get(
      `/users/${this.$route.params.username}/sessions`
    );
    this.sessions = data;
    this.loading = false;
  }

  async deleteSession(id: number) {
    this.$buefy.dialog.confirm({
      title: "Logging out",
      message: `Are you sure you want to log out of this session?`,
      confirmText: "Yes, logout",
      cancelText: "No, don't logout",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        await this.$axios.delete(
          `/users/${this.$route.params.username}/sessions/${id}`
        );
        return this.get();
      }
    });
  }
}
</script>
