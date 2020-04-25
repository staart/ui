<template>
  <div>
    <h1 class="is-size-4">Access Tokens</h1>
    <b-table
      :loading="loading"
      :data="accessTokens.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="id" label="Access Token">
          {{ props.row.id }}
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Delete">
            <b-button
              type="is-danger"
              icon-right="delete"
              @click="deleteAccessToken(props.row.id, props.row.accessToken)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Create an access token</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-button type="is-primary" native-type="submit" :loading="loading">
        Create access token
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "users"
})
export default class UsersAccessTokens extends Vue {
  loading = false;
  accessTokens: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    const { data } = await this.$axios.get(
      `/users/${this.$route.params.username}/access-tokens`
    );
    this.accessTokens = data;
    this.loading = false;
  }

  async add() {
    this.loading = true;
    const { data } = await this.$axios.put(
      `/users/${this.$route.params.username}/access-tokens`
    );
    this.accessTokens.data.push(data.added);
    this.loading = false;
  }

  async deleteAccessToken(id: number, accessToken: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting accessToken",
      message: `Are you sure you want to delete your accessToken <code>${accessToken}</code>? This action is not reversible, and you'll have to verify this accessToken again if you change your mind.`,
      confirmText: "Yes, delete accessToken",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        await this.$axios.delete(
          `/users/${this.$route.params.username}/access-tokens/${id}`
        );
        return this.get();
      }
    });
  }
}
</script>
