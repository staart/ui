<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Access Tokens</h1>
    <b-message type="is-warning" has-icon>
      This feature is for developers only. Your access tokens are like your
      password, and anyone with access to them can change your account settings,
      including billing information. Make sure you keep them safe!
    </b-message>
    <b-table
      :loading="loading"
      :data="accessTokens.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="name" label="Name">
          {{ props.row.name || "Unnamed token" }}
        </b-table-column>
        <b-table-column sortable field="jwtAccessToken" label="Access Token">
          <code>{{ props.row.jwtAccessToken }}</code>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Edit">
            <b-button
              tag="nuxt-link"
              :to="
                `/users/${$route.params.username}/access-tokens/${props.row.id}`
              "
              type="is-primary"
              icon-right="pencil"
              outlined
            />
          </b-tooltip>
          <b-tooltip label="Delete">
            <b-button
              type="is-danger"
              icon-right="delete"
              outlined
              @click="
                deleteAccessToken(
                  props.row.id,
                  props.row.name || 'Unnamed token'
                )
              "
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Create an access token</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Name">
        <b-input type="text" v-model="accessTokenName" />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingCreate">
        Create access token
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
export default class UsersAccessTokens extends Vue {
  loading = false;
  loadingCreate = false;
  accessTokenName = "";
  accessTokens: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.username}/access-tokens`
      );
      this.accessTokens = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingCreate = true;
    try {
      const { data } = await this.$axios.put(
        `/users/${this.$route.params.username}/access-tokens`,
        {
          name: this.accessTokenName ? this.accessTokenName : undefined,
        }
      );
      this.accessTokens.data.push(data.added);
    } catch (error) {}
    this.accessTokenName = "";
    this.loadingCreate = false;
  }

  async deleteAccessToken(id: number, accessToken: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting accessToken",
      message: `Are you sure you want to delete your access token <strong>${accessToken}</strong>? This action is not reversible, and this access token will stop working immediately.`,
      confirmText: "Yes, delete accessToken",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/users/${this.$route.params.username}/access-tokens/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }
}
</script>
