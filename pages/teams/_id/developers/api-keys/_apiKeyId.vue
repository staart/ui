<template>
  <div>
    <h1 class="is-size-4 mb-4">
      <b-button
        tag="nuxt-link"
        :to="`/teams/${$route.params.id}/developers/api-keys`"
        icon-right="arrow-left"
      />
      <span>API key</span>
    </h1>
    <form @submit.prevent="save">
      <b-field label="Name">
        <b-input type="text" v-model="apiKey.name" />
      </b-field>
      <b-field label="API key">
        <b-input type="text" v-model="apiKey.apiKey" readonly />
      </b-field>
      <b-field label="Description">
        <b-input type="textarea" v-model="apiKey.description" />
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
        <b-taginput v-model="ipRestrictions" icon="ip-network" placeholder="Add an IP CIDR"></b-taginput>
      </b-field>
      <b-field label="Referrer restrictions">
        <b-taginput
          v-model="referrerRestrictions"
          icon="domain-plus"
          placeholder="Add a domain name"
        ></b-taginput>
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingUpdate">Update API key</b-button>
    </form>
    <h2 class="is-size-5 mb-3 mt-5">Danger zone</h2>
    <p class="mb-3">
      If your API key was compromized or you don't need it anymore, you can
      delete it.
    </p>
    <b-button
      type="is-danger"
      @click="deleteApiKey(apiKey.id, apiKey.name || 'Unnamed API key')"
      :loading="loadingDelete"
    >Delete API key</b-button>
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
  scopeOptions: any = {};

  async created() {
    this.getScopeOptions();
    return this.get();
  }

  async getScopeOptions() {
    const { data } = await this.$axios.get(
      `/groups/${this.$route.params.id}/api-keys/scopes`
    );
    this.scopeOptions = data;
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/groups/${this.$route.params.id}/api-keys/${this.$route.params.apiKeyId}`
      );
      this.apiKey = data;
      this.scopes = (data.scopes || "").split(",").map((i: string) => i.trim());
      if (data.ipRestrictions)
        this.ipRestrictions = (data.ipRestrictions || [])
          .split(",")
          .map((i: string) => i.trim());
      if (data.referrerRestrictions)
        this.referrerRestrictions = (data.referrerRestrictions || [])
          .split(",")
          .map((i: string) => i.trim());
    } catch (error) {
      this.$router.push(`/groups/${this.$route.params.id}/developers/api-keys`);
    }
    this.loading = false;
  }

  async save() {
    if (this.loadingUpdate) return;
    this.loadingUpdate = true;
    try {
      const { data } = await this.$axios.patch(
        `/groups/${this.$route.params.id}/api-keys/${this.$route.params.apiKeyId}`,
        {
          name: this.apiKey.name,
          description: this.apiKey.description,
          scopes: this.scopes.join(", "),
          ipRestrictions: this.ipRestrictions.join(", ") || undefined,
          referrerRestrictions:
            this.referrerRestrictions.join(", ") || undefined,
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
            `/groups/${this.$route.params.id}/api-keys/${id}`
          );
        } catch (error) {}
        this.$router.push(
          `/teams/${this.$route.params.id}/developers/api-keys`
        );
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
