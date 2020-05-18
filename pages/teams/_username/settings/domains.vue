<template>
  <div>
    <h1 class="is-size-4">Domains</h1>
    <b-message
      v-if="hasUnverifiedDomain"
      type="is-warning"
      style="margin-top: 1rem"
      has-icon
    >
      You have one or more unverified domains in your team. The domain settings
      will not be actived until you verify the domain.
    </b-message>
    <b-table
      :loading="loading"
      :data="domains.data"
      default-sort-direction="asc"
      detail-key="id"
      :opened-detailed="opened"
      detailed
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="domain" label="Domain">
          {{ props.row.domain }}
          <b-tooltip v-if="props.row.isVerified" label="Verified">
            <b-icon icon="check-circle" type="is-success" />
          </b-tooltip>
          <b-tooltip v-else label="Unverified">
            <b-icon icon="alert" type="is-warning" />
          </b-tooltip>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-button type="is-primary" @click="addToOpened(props.row.id)">
            Verify domain
          </b-button>
          <b-tooltip label="Delete">
            <b-button
              type="is-danger"
              icon-right="delete"
              @click="deleteDomain(props.row.id, props.row.domain)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        <div v-if="props.row.isVerified">
          <p>
            <b-icon
              type="is-success"
              icon="check-circle"
              size="is-small"
              style="margin-right: 0.5rem"
            />This domain is successfully verified.
          </p>
        </div>
        <div v-else>
          <p>
            To verify your domain, you can either set a DNS TXT record or update
            a text file.
          </p>
          <h3 class="is-size-5" style="margin-top: 1rem">
            DNS TXT record (recommended)
          </h3>
          <p style="margin-bottom: 1rem">
            Add a new DNS record with the following values:
          </p>
          <table class="table" style="margin-bottom: 1rem">
            <thead>
              <tr>
                <td>Type</td>
                <td>Name</td>
                <td>Content</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>TXT</code></td>
                <td>
                  <code>{{ props.row.domain }}</code>
                </td>
                <td>
                  <code>{{ props.row.verificationCode }}</code>
                </td>
              </tr>
            </tbody>
          </table>
          <b-button
            type="is-primary"
            @click="verifyDomain('dns', props.row.id)"
          >
            Verify DNS record
          </b-button>
          <h3 class="is-size-5" style="margin-top: 1rem">
            File upload
          </h3>
          <p style="margin-bottom: 0.5rem">
            Alternately, upload a file to your domain:
            <code>/.well-known/staart-verify.txt</code>. Once completed, this
            URL should have the contents
            <code>{{ props.row.verificationCode }}</code
            >:
            <a
              :href="`http://${props.row.domain}/.well-known/staart-verify.txt`"
              target="_blank"
            >
              http://{{ props.row.domain }}/.well-known/staart-verify.txt
            </a>
          </p>
          <b-button
            icon-left="cloud-download"
            @click="downloadFile(props.row.verificationCode)"
          >
            Download file
          </b-button>
          <b-button
            type="is-primary"
            @click="verifyDomain('file', props.row.id)"
          >
            Verify uploaded file
          </b-button>
        </div>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="domains.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more domains
      </b-button>
    </div>
    <h2 class="is-size-5" style="margin-top: 1rem">Add domain</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Domain">
        <b-input type="text" v-model="newDomain" required />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd">
        Add domain
      </b-button>
    </form>
    <form @submit.prevent="save" style="margin-top: 1rem">
      <h1 class="is-size-5" style="margin: 1rem 0">Domain settings</h1>
      <b-field>
        <b-checkbox v-model="team.onlyAllowDomain">
          Managers can only invite users with emails on our domains to join this
          team
        </b-checkbox>
      </b-field>
      <b-field>
        <b-checkbox v-model="team.autoJoinDomain">
          Users with verified emails on our domains can automatically join this
          team
        </b-checkbox>
      </b-field>
      <div style="margin-top: 1rem">
        <b-button type="is-primary" native-type="submit" :loading="loadingSave">
          Update domain settings
        </b-button>
      </div>
      <b-loading
        :is-full-page="false"
        :active.sync="loadingSettings"
      ></b-loading>
    </form>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { Vue, Component, Watch } from "vue-property-decorator";
import download from "js-file-download";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersProfile extends Vue {
  loading = false;
  loadingSettings = false;
  loadingSave = false;
  loadingAdd = false;
  opened: number[] = [];
  team: any = {};
  domains: any = { data: [] };
  ipRestrictions: string[] = [];
  newDomain = "";

  async created() {
    this.get();
    this.loadingSettings = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}`
      );
      this.team = data;
    } catch (error) {}
    this.loadingSettings = false;
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/domains?first=10${
          this.domains.data.length
            ? `&after=${this.domains.data[this.domains.data.length - 1].id}`
            : ""
        }`
      );
      this.domains.data.push(...(data.data || []));
      this.domains.hasMore = data.hasMore;
      this.domains = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingAdd = true;
    try {
      const { data } = await this.$axios.put(
        `/organizations/${this.$route.params.username}/domains`,
        {
          domain: this.newDomain,
        }
      );
      this.domains.data.push(data.added);
      this.newDomain = "";
    } catch (error) {}
    this.loadingAdd = false;
  }

  async save() {
    this.loadingSave = true;
    try {
      const { data } = await this.$axios.patch(
        `/organizations/${this.$route.params.username}`,
        {
          autoJoinDomain: this.team.autoJoinDomain,
          onlyAllowDomain: this.team.onlyAllowDomain,
        }
      );
      this.team = data.updated;
    } catch (error) {}
    this.loadingSave = false;
  }

  async deleteDomain(id: number, domain: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting domain",
      message: `Are you sure you want to delete your domain <strong>${domain}</strong>? This action is not reversible, and you'll have to verify this domain again if you change your mind.`,
      confirmText: "Yes, delete domain",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/domains/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }

  downloadFile(text: string) {
    download(text, "staart-verify.txt");
  }

  async verifyDomain(method: string, id: number, domain: string) {
    this.loading = true;
    try {
      const { data } = await this.$axios.post(
        `/organizations/${this.$route.params.username}/domains/${id}/verify`,
        {
          method,
        }
      );
      this.team = data.updated;
    } catch (error) {}
    this.loading = false;
  }

  get hasUnverifiedDomain() {
    return !!this.domains.data.find((i: any) => !i.isVerified);
  }

  addToOpened(id: number) {
    if (!this.opened.includes(id)) this.opened.push(id);
  }
}
</script>
