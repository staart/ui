<template>
  <div class="container container--type-settings">
    <aside>
      <Developer />
    </aside>
    <main class="card">
      <div>
        <div class="row">
          <h1>API keys</h1>
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
        <LargeMessage
          v-if="!loading && (!apiKeys || !apiKeys.data || !apiKeys.data.length)"
          heading="No API keys yet"
          img="undraw_software_engineer_lvl5.svg"
          text="Create an API key below"
        />
        <div v-else-if="apiKeys && apiKeys.data && apiKeys.data.length">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Access</th>
                <th>Restrictions</th>
                <th>Expiry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(apiKey, index) in apiKeys.data"
                :key="`${apiKey.id}_${index}`"
              >
                <td>{{ apiKey.name || "Unnamed API key" }}</td>
                <td v-if="apiKey.scopes">
                  {{ apiKey.scopes.split(",").length }} API{{
                    apiKey.scopes.split(",").length === 1 ? "" : "s"
                  }}
                </td>
                <td v-else>No APIs</td>
                <td v-if="apiKey.ipRestrictions || apiKey.referrerRestrictions">
                  {{
                    (apiKey.ipRestrictions || "").split(",").length +
                      (apiKey.referrerRestrictions || "").split(",").length
                  }}
                  restriction{{
                    (apiKey.ipRestrictions || "").split(",").length +
                      (apiKey.referrerRestrictions || "").split(",").length ===
                    1
                      ? ""
                      : "s"
                  }}
                </td>
                <td v-else>No restrictions</td>
                <td><TimeAgo :date="apiKey.expiresAt" /></td>
                <td class="text text--align-right">
                  <router-link
                    :to="
                      `/teams/${$route.params.team}/developer/api-keys/${apiKey.id}`
                    "
                    aria-label="View"
                    data-balloon-pos="up"
                    class="button button--type-icon"
                  >
                    <font-awesome-icon class="icon" icon="eye" fixed-width />
                  </router-link>
                  <router-link
                    :to="
                      `/teams/${$route.params.team}/developer/logs?key=${apiKey.id}`
                    "
                    aria-label="Logs"
                    data-balloon-pos="up"
                    class="button button--type-icon"
                  >
                    <font-awesome-icon
                      class="icon"
                      icon="chart-line"
                      fixed-width
                    />
                  </router-link>
                  <button
                    aria-label="Delete"
                    data-balloon-pos="up"
                    class="button button--type-icon button--color-danger"
                    @click="() => (showDelete = apiKey)"
                  >
                    <font-awesome-icon class="icon" icon="trash" fixed-width />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
        </div>
        <Loading v-else :message="loading" />
        <div class="text text--mt-2">
          <h2>Create API key</h2>
          <p>
            You can use API keys to programmatically access StartupName in your
            applications.
          </p>
          <form @submit.prevent="createApiKey">
            <CheckList
              label="API restrictions"
              :options="scopes"
              :value="newScopes"
              placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
              @input="val => (newScopes = val)"
            />
            <p class="text text--color-muted text--size-small">
              You can add IP and referrer restrictions after creating the API
              key.
            </p>
            <button class="button">Create API key</button>
          </form>
        </div>
      </div>
      <transition name="modal">
        <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
          <h2>Are you sure you want to delete this API key?</h2>
          <p>
            Deleting an API key is not reversible, and you'll need to update any
            apps using this key.
          </p>
          <button
            class="button button--color-danger button--state-cta"
            @click="deleteApiKey(showDelete.id)"
          >
            Yes, delete API key
          </button>
          <button type="button" class="button" @click="showDelete = null">
            No, don't delete
          </button>
        </Confirm>
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSync,
  faTrash,
  faEye,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import Developer from "@/components/sidebars/Developer.vue";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
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
library.add(faArrowDown, faSync, faTrash, faEye, faChartLine);

@Component({
  components: {
    Loading,
    Confirm,
    CheckList,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox,
    Developer
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  apiKeys: ApiKeys = emptyPagination;
  showDelete: ApiKey | null = null;
  loadingMore = false;
  loading = "";
  newScopes = "orgRead";
  scopes = scopes;

  private created() {
    this.apiKeys = {
      ...this.$store.getters["manage/apiKeys"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your API keys";
    this.$store
      .dispatch("manage/getApiKeys", { team: this.$route.params.team })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
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

  private createApiKey() {
    this.loading = "Creating your API key";
    this.$store
      .dispatch("manage/createApiKey", {
        team: this.$route.params.team,
        scopes: this.newScopes ? this.newScopes : undefined
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newScopes = "";
      });
  }

  private deleteApiKey(key: number) {
    this.showDelete = null;
    this.loading = "Deleting your API key";
    this.$store
      .dispatch("manage/deleteApiKey", {
        team: this.$route.params.team,
        id: key
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
