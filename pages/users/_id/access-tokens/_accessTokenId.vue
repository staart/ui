<template>
  <div>
    <h1 class="is-size-4 mb-4">
      <b-button
        tag="nuxt-link"
        :to="`/users/${$route.params.id}/access-tokens`"
        icon-right="arrow-left"
      />
      <span>Access Token</span>
    </h1>
    <form @submit.prevent="save">
      <b-field label="Name">
        <b-input type="text" v-model="accessToken.name" />
      </b-field>
      <b-field label="Access token">
        <b-input type="text" v-model="accessToken.accessToken" readonly />
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="accessToken.description" />
      </b-field>
      <b-field label="Scopes">
        <dl>
          <span v-for="key in Object.keys(scopeOptions)" :key="`s${key}`">
            <dt>
              <b-checkbox
                :indeterminate="
                  scopes.some(r =>
                    scopeOptions[key].map(i => i.value).includes(r)
                  ) &&
                    !scopeOptions[key]
                      .map(i => i.value)
                      .every(r => scopes.includes(r))
                "
                :value="
                  scopeOptions[key]
                    .map(i => i.value)
                    .every(r => scopes.includes(r))
                "
                @input="
                  val =>
                    val
                      ? scopes.push(...scopeOptions[key].map(i => i.value))
                      : (scopes = scopes.filter(
                          r => !scopeOptions[key].map(i => i.value).includes(r)
                        ))
                "
              >{{ key }}</b-checkbox>
            </dt>
            <dd v-for="key2 in scopeOptions[key]" :key="`s${key}${key2.value}`">
              <b-checkbox v-model="scopes" :native-value="key2.value">
                {{
                key2.name
                }}
              </b-checkbox>
            </dd>
          </span>
        </dl>
      </b-field>
      <b-field label="IP address restrictions">
        <b-taginput
          v-model="accessToken.ipRestrictions"
          icon="ip-network"
          placeholder="Add an IP CIDR"
        ></b-taginput>
      </b-field>
      <b-field label="Referrer restrictions">
        <b-taginput
          v-model="accessToken.referrerRestrictions"
          icon="domain-plus"
          placeholder="Add a domain name"
        ></b-taginput>
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingUpdate">Update access token</b-button>
    </form>
    <h2 class="is-size-5 mb-3 mt-5">Danger zone</h2>
    <p class="mb-3">
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
          scopes: [...new Set(this.scopes)],
          description: this.accessToken.description,
          ipRestrictions: this.accessToken.ipRestrictions,
          referrerRestrictions: this.accessToken.referrerRestrictions,
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
