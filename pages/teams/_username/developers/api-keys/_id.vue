<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">
      <b-button
        tag="nuxt-link"
        :to="`/teams/${$route.params.username}/developers/api-keys`"
        icon-right="arrow-left"
        style="margin-right: 1rem"
      />
      <span>API key</span>
      <code v-if="apiKey.jwtApiKey">
        {{ apiKey.jwtApiKey }}
      </code>
    </h1>
    <form @submit.prevent="save" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Name">
        <b-input type="text" v-model="apiKey.name" />
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="apiKey.description" />
      </b-field>
      <b-field label="Scopes">
        <b-select multiple v-model="scopes" expanded>
          <option value="org:read">org:read</option>
          <option value="org:update">org:update</option>
          <option value="org:delete">org:delete</option>
          <option value="org:billing:read">org:billing:read</option>
          <option value="org:billing:update">org:billing:update</option>
          <option value="org:invoices:read">org:invoices:read</option>
          <option value="org:sources:read">org:sources:read</option>
          <option value="org:sources:create">org:sources:create</option>
          <option value="org:sources:update">org:sources:update</option>
          <option value="org:sources:delete">org:sources:delete</option>
          <option value="org:subscriptions:read">org:subscriptions:read</option>
          <option value="org:subscriptions:update"
            >org:subscriptions:update</option
          >
          <option value="org:subscriptions:create"
            >org:subscriptions:create</option
          >
          <option value="org:plans:read">org:plans:read</option>
          <option value="org:api-key:read">org:api-key:read</option>
          <option value="org:api-key-logs:read">org:api-key-logs:read</option>
          <option value="org:api-key:update">org:api-key:update</option>
          <option value="org:api-key:delete">org:api-key:delete</option>
          <option value="org:api-key:create">org:api-key:create</option>
          <option value="org:domain:read">org:domain:read</option>
          <option value="org:domain:update">org:domain:update</option>
          <option value="org:domain:delete">org:domain:delete</option>
          <option value="org:domain:create">org:domain:create</option>
          <option value="org:domain:verify">org:domain:verify</option>
          <option value="org:webhook:read">org:webhook:read</option>
          <option value="org:webhook:update">org:webhook:update</option>
          <option value="org:webhook:delete">org:webhook:delete</option>
          <option value="org:webhook:create">org:webhook:create</option>
          <option value="org:membership:read">org:membership:read</option>
          <option value="org:membership:update">org:membership:update</option>
          <option value="org:membership:delete">org:membership:delete</option>
          <option value="org:membership:create">org:membership:create</option>
          <option value="org:transactions:read">org:transactions:read</option>
          <option value="org:transactions:update"
            >org:transactions:update</option
          >
          <option value="org:transactions:delete"
            >org:transactions:delete</option
          >
          <option value="org:transactions:create"
            >org:transactions:create</option
          >
        </b-select>
      </b-field>
      <b-field label="IP address restrictions">
        <b-taginput
          v-model="ipRestrictions"
          icon="ip-network"
          placeholder="Add an IP CIDR"
        >
        </b-taginput>
      </b-field>
      <b-field label="Referrer restrictions">
        <b-taginput
          v-model="referrerRestrictions"
          icon="domain-plus"
          placeholder="Add a domain name"
        >
        </b-taginput>
      </b-field>
      <b-field label="Expiry">
        <b-datepicker
          placeholder="Click to select..."
          icon="calendar-today"
          trap-focus
          v-model="expiresAt"
        />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingUpdate">
        Update API key
      </b-button>
    </form>
    <h2 class="is-size-5">Danger zone</h2>
    <p style="margin: 1rem 0">
      If your API key was compromized or you don't need it anymore, you can
      delete it.
    </p>
    <b-button
      type="is-danger"
      @click="deleteApiKey(apiKey.id, apiKey.name || 'Unnamed API key')"
      :loading="loadingDelete"
    >
      Delete API key
    </b-button>
    <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
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
  loadingUpdate = false;
  loadingDelete = false;
  apiKey: any = {};
  scopes: string[] = [];
  ipRestrictions: string[] = [];
  referrerRestrictions: string[] = [];
  expiresAt = new Date();

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/api-keys/${this.$route.params.id}`
      );
      this.apiKey = data;
      this.scopes = (data.scopes || "").split(",").map((i: string) => i.trim());
      this.expiresAt = new Date(data.expiresAt);
      if (data.ipRestrictions)
        this.ipRestrictions = (data.ipRestrictions || [])
          .split(",")
          .map((i: string) => i.trim());
      if (data.referrerRestrictions)
        this.referrerRestrictions = (data.referrerRestrictions || [])
          .split(",")
          .map((i: string) => i.trim());
    } catch (error) {
      this.$router.push(
        `/organizations/${this.$route.params.username}/developers/api-keys`
      );
    }
    this.loading = false;
  }

  async save() {
    if (this.loadingUpdate) return;
    this.loadingUpdate = true;
    try {
      const { data } = await this.$axios.patch(
        `/organizations/${this.$route.params.username}/api-keys/${this.$route.params.id}`,
        {
          name: this.apiKey.name,
          description: this.apiKey.description,
          scopes: this.scopes.join(", "),
          ipRestrictions: this.ipRestrictions.join(", ") || undefined,
          referrerRestrictions:
            this.referrerRestrictions.join(", ") || undefined,
          expiresAt: this.expiresAt,
        }
      );
      this.apiKey = data.updated;
    } catch (error) {}
    this.loadingUpdate = false;
  }

  async deleteApiKey(id: number, apiKey: string) {
    if (this.loadingDelete) return;
    this.$buefy.dialog.confirm({
      title: "Deleting API key",
      message: `Are you sure you want to delete your API key <strong>${apiKey}</strong>? This action is not reversible, and this API key will stop working immediately.`,
      confirmText: "Yes, delete API key",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingDelete = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/api-keys/${id}`
          );
        } catch (error) {}
        this.$router.push(
          `/teams/${this.$route.params.username}/developers/api-keys`
        );
      },
    });
  }
}
</script>
