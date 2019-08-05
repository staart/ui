<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>API logs</h1>
        <div class="text text--align-right">
          <button
            aria-label="Refresh"
            data-balloon-pos="down"
            class="button button--type-icon"
            @click="load"
          >
            <font-awesome-icon class="icon" icon="sync" fixed-width />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="!loading && (!apiKeys || !apiKeys.data || !apiKeys.data.length)"
        heading="No API keys yet"
        img="undraw_software_engineer_lvl5.svg"
      />
      <div v-else-if="apiKeys && apiKeys.data && apiKeys.data.length">
        <form @submit.prevent="loadData">
          <div class="row">
            <Select
              label="API key"
              :options="apiKeyOptions"
              :value="activeApiKey"
              @input="val => (activeApiKey = val)"
            />
            <Select
              label="Time filter"
              :options="timeOptions"
              :value="timeFilter"
              @input="val => (timeFilter = val)"
            />
            <div style="display: flex; margin-bottom: 1rem; margin-top: 2rem;">
              <button class="button">Load API logs</button>
            </div>
          </div>
        </form>
        <div class="pagination text text--align-center">
          <button
            v-if="apiKeys && apiKeys.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more API keys</span>
            <font-awesome-icon
              v-if="!loadingMore"
              class="icon"
              icon="arrow-down"
            />
            <font-awesome-icon
              v-else
              class="icon icon--ml-2 icon--color-light"
              icon="sync"
              spin
            />
          </button>
        </div>
        <div>
          <LargeMessage
            v-if="!loading && (!data || !data.hits || !data.hits.total)"
            heading="No API logs yet"
            img="undraw_software_engineer_lvl5.svg"
            text="We couldn't find any API logs for this API key yet, go ahead and make some requests first"
          />
          <div v-else>
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Response time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, i) in data.hits.hits" :key="`l${log._id}${i}`">
                  <td><TimeAgo :date="log._source.date" /></td>
                  <td>{{ log._source.method }}</td>
                  <td>
                    <code>{{ log._source.url.split("?")[0] }}</code>
                  </td>
                  <td><HTTPStatus :status="log._source.statusCode" /></td>
                  <td>
                    {{
                      new Date(log._source.completedDate).getTime() -
                        new Date(log._source.date).getTime()
                    }}
                    ms
                  </td>
                  <td>
                    <button
                      aria-label="Download JSON"
                      data-balloon-pos="up"
                      class="button button--type-icon"
                      @click="() => downloadJson(log)"
                    >
                      <font-awesome-icon
                        class="icon"
                        icon="cloud-download-alt"
                        fixed-width
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import download from "downloadjs";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSync,
  faCloudDownloadAlt
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import HTTPStatus from "@/components/HTTPStatus.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import CheckList from "@/components/form/CheckList.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { ApiKeys, emptyPagination, ApiKey } from "@/types/manage";
import translations from "@/locales/en";
const scopes = translations.scopes;
library.add(faArrowDown, faSync, faCloudDownloadAlt);

@Component({
  components: {
    Loading,
    Confirm,
    HTTPStatus,
    CheckList,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  apiKeys: ApiKeys = emptyPagination;
  data: any = null;
  showDelete: ApiKey | null = null;
  loadingMore = false;
  loading = "";
  newScopes = "orgRead";
  scopes = scopes;
  loggedInMembership = 3;
  activeApiKey = 0;
  apiKeyOptions: any = {};
  timeFilter = "24h";
  timeOptions = {
    "60s": "Last 60 seconds",
    "10m": "Last 10 minutes",
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days"
  };

  private created() {
    this.apiKeys = {
      ...this.$store.getters["manage/apiKeys"](this.$route.params.team)
    };
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
  }

  private load() {
    this.loading = "Loading your API keys";
    this.$store
      .dispatch("manage/getApiKeys", { team: this.$route.params.team })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
        const apiKeyOptions = {};
        apiKeys.data.forEach(apiKey => {
          apiKeyOptions[apiKey.id] = apiKey.name || apiKey.id;
        });
        this.apiKeyOptions = apiKeyOptions;
        if (apiKeys && apiKeys.data && apiKeys.data.length)
          return apiKeys.data[0].id;
        this.loading = "";
      })
      .then(apiKeyId => {
        if (apiKeyId) this.activeApiKey = apiKeyId;
        return this.loadData();
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  private mounted() {
    this.load();
  }

  private loadData() {
    if (!this.activeApiKey) return;
    this.loading = "Loading your API logs";
    this.$store
      .dispatch("manage/getApiKeyLogs", {
        team: this.$route.params.team,
        id: this.activeApiKey
      })
      .then(data => {
        this.data = data;
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getApiKeys", {
        team: this.$route.params.team,
        start: this.$store.state.manage.apiKeys[this.$route.params.team].next
      })
      .then(() => {
        this.apiKeys = {
          ...this.$store.getters["manage/apiKeys"](this.$route.params.team)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private downloadJson(log) {
    download(
      JSON.stringify(log._source, null, 2),
      `log-${log._id}.json`,
      "application/json"
    );
  }
}
</script>

<style lang="scss" scoped></style>
