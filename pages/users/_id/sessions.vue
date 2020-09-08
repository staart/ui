<template>
  <div>
    <h1 class="is-size-4 mb-4">Sessions</h1>
    <b-table
      :loading="loading && !sessions.data.length"
      :data="sessions.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <b-table-column v-slot="props" label="Session">
        <b-tooltip
          v-for="(type, i) in ['Browser', 'OS', 'CountryCode']"
          :key="`t${i}${type}`"
          :label="getCaption(props.row, type)"
        >
          <figure class="image is-24x24" v-if="getCaption(props.row, type)">
            <img class="is-rounded" :src="getIcon(props.row, type)" />
          </figure>
        </b-tooltip>
      </b-table-column>
      <b-table-column
        v-slot="props"
        sortable
        field="createdAt"
        label="Logged in"
      >{{ new Date(props.row.createdAt).toLocaleString() }}</b-table-column>
      <b-table-column v-slot="props" cell-class="has-text-right">
        <b-tooltip label="Logout">
          <b-button
            type="is-danger"
            icon-right="logout-variant"
            @click="deleteSession(props.row.id)"
          />
        </b-tooltip>
      </b-table-column>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="sessions.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >Load more sessions</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
const UAParser = require("ua-parser-js");
import icon from "analytics-icons";
import ct from "countries-and-timezones";

@Component({
  middleware: "authenticated",
  layout: "users",
})
export default class UsersSessions extends Vue {
  loading = false;
  loadingMore = false;
  sessions: any = { data: [] };

  async created() {
    return this.get();
  }

  getIcon(row: any, keyName: string) {
    if (keyName === "CountryCode") return icon(row.countryCode);
    const parser = new UAParser(row.userAgent);
    return icon(parser[`get${keyName}`]?.call()?.name);
  }
  getCaption(row: any, keyName: string) {
    if (keyName === "CountryCode")
      return ["city", "region"]
        .map((i) => row[i])
        .filter((i) => i)
        .join(", ");
    const parser = new UAParser(row.userAgent);
    return parser[`get${keyName}`]?.call()?.name;
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.id}/sessions?take=10&orderBy=id:desc${
          this.sessions.data.length
            ? `&after=${this.sessions.data[this.sessions.data.length - 1].id}`
            : ""
        }`
      );
      this.sessions.data.push(...(data.data || []));
      this.sessions.hasMore = data.hasMore;
    } catch (error) {}
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
        try {
          const { data } = await this.$axios.delete(
            `/users/${this.$route.params.id}/sessions/${id}`
          );
        } catch (error) {}
        await this.get();
      },
    });
  }
}
</script>

<style scoped>
figure.image {
  margin-right: 0.5rem;
}
</style>
