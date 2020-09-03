<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Access Tokens</h1>
    <b-table
      :loading="loading"
      :data="accessTokens.data"
      :opened-detailed="defaultOpenedDetails"
      detailed
      detail-key="id"
      :show-detail-icon="false"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="name" label="Name">
          {{
          props.row.name || "Unnamed token"
          }}
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{
          new Date(props.row.createdAt).toLocaleDateString()
          }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip :label="defaultOpenedDetails.includes(props.row.id) ? 'Hide' : 'View'">
            <b-button
              icon-right="eye"
              type="is-primary"
              outlined
              v-if="!defaultOpenedDetails.includes(props.row.id)"
              @click="defaultOpenedDetails.push(props.row.id)"
            />
            <b-button
              icon-right="eye-off"
              type="is-primary"
              outlined
              @click="defaultOpenedDetails = defaultOpenedDetails.filter(i => i !== props.row.id)"
              v-else
            />
          </b-tooltip>
          <b-tooltip label="Edit">
            <b-button
              tag="nuxt-link"
              :to="`/users/${$route.params.id}/access-tokens/${props.row.id}`"
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
      <template slot="detail" slot-scope="props">
        Access token:
        <code>{{props.row.accessToken}}</code>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Create an access token</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Name">
        <b-input type="text" v-model="accessTokenName" />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingCreate">Create access token</b-button>
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
  defaultOpenedDetails = [];

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.id}/access-tokens`
      );
      this.accessTokens = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingCreate = true;
    try {
      const { data } = await this.$axios.put(
        `/users/${this.$route.params.id}/access-tokens`,
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
      title: "Deleting access token",
      message: `Are you sure you want to delete your access token <strong>${accessToken}</strong>? This action is not reversible, and this access token will stop working immediately.`,
      confirmText: "Yes, delete access token",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/users/${this.$route.params.id}/access-tokens/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }
}
</script>
