<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">
      <b-button
        tag="nuxt-link"
        :to="`/users/${$route.params.id}/access-tokens`"
        icon-right="arrow-left"
        style="margin-right: 1rem"
      />
      <span>Access Token</span>
      <code v-if="accessToken.accessToken">{{ accessToken.accessToken }}</code>
    </h1>
    <form @submit.prevent="save" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Name">
        <b-input type="text" v-model="accessToken.name" />
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="accessToken.description" />
      </b-field>
      <b-field label="Scopes">
        <dl>
          <span v-for="key in Object.keys(scopeOptions)" :key="`s${key}`">
            <dt>
              <b-checkbox
                :indeterminate="scopes.some(r => scopeOptions[key].includes(r)) && !scopeOptions[key].every(r => scopes.includes(r))"
                :value="scopeOptions[key].every(r => scopes.includes(r))"
                @input="val => val ? (scopes.push(...scopeOptions[key])) : (scopes = scopes.filter(r => !scopeOptions[key].includes(r)))"
              >{{key}}</b-checkbox>
            </dt>
            <dd v-for="key2 in scopeOptions[key]" :key="`s${key}${key2}`">
              <b-checkbox v-model="scopes" :native-value="key2">{{key2}}</b-checkbox>
            </dd>
          </span>
        </dl>
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingUpdate">Update access token</b-button>
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
    >Delete access token</b-button>
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
  scopeOptions: any = {};

  async created() {
    this.getScopeOptions();
    return this.get();
  }

  async getScopeOptions() {
    const { data } = await this.$axios.get(
      `/users/${this.$route.params.id}/security/access-token-scopes`
    );
    this.scopeOptions = data;
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.id}/access-tokens/${this.$route.params.accessTokenId}`
      );
      this.accessToken = data;
    } catch (error) {
      this.$router.push(`/users/${this.$route.params.id}/access-tokens`);
    }
    this.loading = false;
  }

  async save() {
    if (this.loadingUpdate) return;
    this.loadingUpdate = true;
    try {
      const { data } = await this.$axios.patch(
        `/users/${this.$route.params.id}/access-tokens/${this.$route.params.accessTokenId}`,
        {
          name: this.accessToken.name,
          scopes: [...new Set(this.accessToken.scopes)],
          description: this.accessToken.description,
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
            `/users/${this.$route.params.id}/access-tokens/${id}`
          );
        } catch (error) {}
        this.$router.push(`/users/${this.$route.params.id}/access-tokens`);
      },
    });
  }
}
</script>

<style scoped>
dl {
  columns: 300px 2;
  line-height: 1.8;
}
dd {
  margin-left: 1rem;
}
</style>
