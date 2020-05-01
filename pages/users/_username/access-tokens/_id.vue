<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">
      <b-button
        tag="nuxt-link"
        :to="`/users/${$route.params.username}/access-tokens`"
        icon-right="arrow-left"
        style="margin-right: 1rem"
      />
      <span>Access Token</span>
      <code v-if="accessToken.jwtAccessToken">
        {{ accessToken.jwtAccessToken }}
      </code>
    </h1>
    <form @submit.prevent="save" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Name">
        <b-input type="text" v-model="accessToken.name" />
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="accessToken.description" />
      </b-field>
      <b-field label="Scopes">
        <b-select multiple v-model="scopes" expanded>
          <option value="user:read">user:read</option>
          <option value="user:update">user:update</option>
          <option value="user:change-password">user:change-password</option>
          <option value="user:delete">user:delete</option>
          <option value="user:memberships:read">user:memberships:read</option>
          <option value="user:memberships:delete"
            >user:memberships:delete</option
          >
          <option value="user:memberships:update"
            >user:memberships:update</option
          >
          <option value="user:2fa:enable">user:2fa:enable</option>
          <option value="user:2fa:disable">user:2fa:disable</option>
          <option value="user:backup-codes:read">user:backup-codes:read</option>
          <option value="user:backup-codes:regenerate"
            >user:backup-codes:regenerate</option
          >
          <option value="user:access-tokens:create"
            >user:access-tokens:create</option
          >
          <option value="user:access-tokens:read"
            >user:access-tokens:read</option
          >
          <option value="user:access-tokens:update"
            >user:access-tokens:update</option
          >
          <option value="user:access-tokens:delete"
            >user:access-tokens:delete</option
          >
          <option value="user:emails:create">user:emails:create</option>
          <option value="user:emails:read">user:emails:read</option>
          <option value="user:emails:delete">user:emails:delete</option>
          <option value="user:emails:resend-verification"
            >user:emails:resend-verification</option
          >
          <option value="user:sessions:create">user:sessions:create</option>
          <option value="user:sessions:read">user:sessions:read</option>
          <option value="user:sessions:delete">user:sessions:delete</option>
          <option value="user:identities:create">user:identities:create</option>
          <option value="user:identities:read">user:identities:read</option>
          <option value="user:identities:delete">user:identities:delete</option>
        </b-select>
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
        Update access token
      </b-button>
    </form>
    <h2 class="is-size-5">Danger zone</h2>
    <p style="margin: 1rem 0">
      If your access token was compromized or you don't need it anymore, you can
      delete it.
    </p>
    <b-button
      type="is-danger"
      @click="
        deleteAccessToken(
          accessToken.id,
          accessToken.name || 'Unnamed access token'
        )
      "
      :loading="loadingDelete"
    >
      Delete access token
    </b-button>
    <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
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
  loadingUpdate = false;
  loadingDelete = false;
  accessToken: any = {};
  scopes: string[] = [];
  expiresAt = new Date();

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.username}/access-tokens/${this.$route.params.id}`
      );
      this.accessToken = data;
      this.scopes = (data.scopes || "").split(",").map((i: string) => i.trim());
      this.expiresAt = new Date(data.expiresAt);
    } catch (error) {
      this.$router.push(`/users/${this.$route.params.username}/access-tokens`);
    }
    this.loading = false;
  }

  async save() {
    if (this.loadingUpdate) return;
    this.loadingUpdate = true;
    try {
      const { data } = await this.$axios.patch(
        `/users/${this.$route.params.username}/access-tokens/${this.$route.params.id}`,
        {
          name: this.accessToken.name,
          description: this.accessToken.description,
          scopes: this.scopes.join(", "),
          expiresAt: this.expiresAt,
        }
      );
      this.accessToken = data.updated;
    } catch (error) {}
    this.loadingUpdate = false;
  }

  async deleteAccessToken(id: number, accessToken: string) {
    if (this.loadingDelete) return;
    this.$buefy.dialog.confirm({
      title: "Deleting accessToken",
      message: `Are you sure you want to delete your access token <strong>${accessToken}</strong>? This action is not reversible, and this access token will stop working immediately.`,
      confirmText: "Yes, delete accessToken",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingDelete = true;
        try {
          await this.$axios.delete(
            `/users/${this.$route.params.username}/access-tokens/${id}`
          );
        } catch (error) {}
        this.$router.push(
          `/users/${this.$route.params.username}/access-tokens`
        );
      },
    });
  }
}
</script>
