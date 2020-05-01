<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">API keys</h1>
    <b-message
      v-if="hasUnrestrictedApiKey"
      type="is-warning"
      style="margin-top: 1rem"
      has-icon
    >
      You have one or more unrestricted API keys in your team. It's recommended
      to add scope, referrer, or IP address restrictions.
    </b-message>
    <b-table
      :loading="loading"
      :data="apiKeys.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="name" label="Name">
          {{ props.row.name || "Unnamed API key" }}
          <b-tooltip
            v-if="
              !(
                props.row.ipRestrictions ||
                props.row.referrerRestrictions ||
                props.row.scopes
              )
            "
            label="Unrestricted"
          >
            <b-icon icon="alert" type="is-warning" />
          </b-tooltip>
        </b-table-column>
        <b-table-column sortable field="jwtApiKey" label="API key">
          <code>{{ props.row.jwtApiKey }}</code>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Edit">
            <b-button
              tag="nuxt-link"
              :to="
                `/teams/${$route.params.username}/developers/api-keys/${props.row.id}`
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
                deleteApiKey(props.row.id, props.row.name || 'Unnamed API key')
              "
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Create an API key</h2>
    <p>
      You'll be able to add restrictions such as scopes, referrers, IP
      addresses, and expiry after creating the API key.
    </p>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Name">
        <b-input type="text" v-model="apiKeyName" />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingCreate">
        Create API key
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersApiKeys extends Vue {
  loading = false;
  loadingCreate = false;
  apiKeyName = "";
  apiKeys: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/api-keys`
      );
      this.apiKeys = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingCreate = true;
    try {
      const { data } = await this.$axios.put(
        `/organizations/${this.$route.params.username}/api-keys`,
        {
          name: this.apiKeyName ? this.apiKeyName : undefined,
        }
      );
      this.apiKeys.data.push(data.added);
    } catch (error) {}
    this.apiKeyName = "";
    this.loadingCreate = false;
  }

  async deleteApiKey(id: number, apiKey: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting API key",
      message: `Are you sure you want to delete your API key <strong>${apiKey}</strong>? This action is not reversible, and this API key will stop working immediately.`,
      confirmText: "Yes, delete API key",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/api-keys/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }

  get hasUnrestrictedApiKey() {
    return !!this.apiKeys.data.find(
      (i: any) => !(i.ipRestrictions || i.referrerRestrictions || i.scopes)
    );
  }
}
</script>
