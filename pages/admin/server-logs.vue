<template>
  <main>
    <div>
      <div>
        <div class="row">
          <h1>Server logs</h1>
          <div class="text text--align-right">
            <button
              aria-label="Refresh"
              data-balloon-pos="down"
              class="button button--type-icon"
              @click="load"
            >
              <font-awesome-icon
                class="icon"
                icon="sync"
                :spin="!!loading"
                fixed-width
              />
            </button>
          </div>
        </div>
        <div>
          <form @submit.prevent="load">
            <div class="row">
              <div
                v-if="data && data.count"
                class="column column--type-shrink text text--mr-2"
              >
                <div class="text text--size-250">
                  {{ data.count | number }}
                </div>
                <div>requests</div>
              </div>
              <Select
                label="Time filter"
                :options="timeOptions"
                :value="timeFilter"
                @input="val => (timeFilter = val)"
              />
              <div
                class="column column--type-shrink"
                style="display: flex; margin-bottom: 1rem; margin-top: 2rem;"
              >
                <button style="white-space: nowrap" class="button">
                  Load server logs
                </button>
              </div>
            </div>
          </form>
          <div>
            <LargeMessage
              v-if="!loading && (!data || !data.data || !data.data.length)"
              heading="No server logs yet"
              img="undraw_software_engineer_lvl5.svg"
              text="We couldn't find any server logs, go ahead and make some requests first"
            />
            <div
              v-else-if="data && data.data && data.data.length"
              :class="{ loading }"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>URL</th>
                    <th>UA</th>
                    <th>Time</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(log, i) in data.data" :key="`l${log._id}${i}`">
                    <td v-if="log._source && log._source.date">
                      <TimeAgo :date="log._source.date" />
                    </td>
                    <td class="less-pad">
                      <input
                        v-if="log._source && log._source.url"
                        class="input input--font-monospace input--padding-condensed"
                        :value="log._source.url"
                        disabled
                      />
                    </td>
                    <td v-if="log._source">
                      <Country
                        v-if="log._source.ipCountry"
                        :code="log._source.ipCountry"
                        :show-text="false"
                      />
                      <IconText
                        v-if="log._source.userAgent"
                        :text="getBrowserName(log._source.userAgent)"
                        :show-text="false"
                      />
                      <IconText
                        v-if="log._source.userAgent"
                        :text="getManufactererName(log._source.userAgent)"
                        :show-text="false"
                      />
                    </td>
                    <td v-else><em>No UA</em></td>
                    <td
                      v-if="
                        log._source &&
                          log._source.completedDate &&
                          log._source.date
                      "
                    >
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
              <div class="pagination text text--align-center">
                <button
                  v-if="data && data.hasMore"
                  class="button"
                  :disabled="loadingMore"
                  @click="loadMore"
                >
                  <span>Load more logs</span>
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
            </div>
            <Loading v-else :message="loading" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import download from "downloadjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faArrowDown,
  faSync,
  faCloudDownloadAlt
} from "@fortawesome/free-solid-svg-icons";
import WhichBrowser from "which-browser";
import { emptyPagination, ServerLogs } from "@/types/admin";
import Select from "@/components/form/Select.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Country from "@/components/Country.vue";
import IconText from "@/components/IconText.vue";
import HTTPStatus from "@/components/HTTPStatus.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Loading from "@/components/Loading.vue";
library.add(faEye, faArrowDown, faSync, faCloudDownloadAlt);

@Component({
  middleware: "auth",
  components: {
    Loading,
    LargeMessage,
    Select,
    TimeAgo,
    HTTPStatus,
    Country,
    IconText,
    FontAwesomeIcon
  }
})
export default class Dashboard extends Vue {
  loading = "";
  loadingMore = false;
  data: ServerLogs = emptyPagination;
  timeFilter = "24h";
  from = 0;
  timeOptions = {
    "10s": "Last 10 seconds",
    "60s": "Last 60 seconds",
    "10m": "Last 10 minutes",
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days"
  };

  private created() {
    this.data = {
      ...this.$store.getters["admin/serverLogs"]()
    };
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.from = 0;
    this.loading = "Loading your server logs";
    this.$store
      .dispatch("admin/getServerLogs", {
        range: this.timeFilter,
        from: this.from
      })
      .then(data => {
        this.data = data;
        if (!data || !data.data || !data.data.length)
          throw new Error("no-data");
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private loadMore() {
    const data = { ...this.data };
    if (data && data.data) {
      this.from = data.data.length;
    }
    this.loadingMore = true;
    this.$store
      .dispatch("admin/getServerLogs", {
        range: this.timeFilter,
        from: this.from
      })
      .then(() => {
        this.data = {
          ...this.$store.getters["admin/serverLogs"]()
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

  getBrowserName(userAgent) {
    const result = new WhichBrowser(userAgent);
    return result.browser.name;
  }
  getManufactererName(userAgent) {
    const result = new WhichBrowser(userAgent);
    return result.device.manufacturer;
  }
}
</script>

<style lang="scss" scoped>
td.less-pad {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
