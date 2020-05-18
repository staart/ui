<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Users</h1>
    <b-table
      :loading="loading"
      :data="users.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          sortable
          field="countryCode"
          label="Country"
          style="text-transform: uppercase"
        >
          {{ props.row.countryCode }}
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Created">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-button
            type="is-primary"
            tag="nuxt-link"
            :to="`/users/${props.row.username}`"
          >
            Go to user
          </b-button>
        </b-table-column>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="users.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more users
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
export default class AdminUsers extends Vue {
  loading = false;
  users: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/admin/users?first=10&orderBy=id:desc${
          this.users.data.length
            ? `&after=${this.users.data[this.users.data.length - 1].id}`
            : ""
        }`
      );
      this.users.data.push(...(data.data || []));
      this.users.hasMore = data.hasMore;
      this.users = data;
    } catch (error) {}
    this.loading = false;
  }
}
</script>
