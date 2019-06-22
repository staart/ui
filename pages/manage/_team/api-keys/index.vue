<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
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
              title="Refresh"
              class="icon"
              icon="sync"
              fixed-width
            />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="!loading && (!apiKeys || !apiKeys.data || !apiKeys.data.length)"
        heading="No API keys yet"
        text="Create an API key below"
      />
      <div v-else-if="apiKeys && apiKeys.data && apiKeys.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>API key</th>
              <th>Secret key</th>
              <th>Access</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(apiKey, index) in apiKeys.data"
              :key="`${apiKey.apiKey}_${index}`"
            >
              <td>
                <code>{{ apiKey.apiKey }}</code>
              </td>
              <td>
                <code>{{ apiKey.secretKey }}</code>
              </td>
              <td>{{ apiKey.access ? "Full access" : "Read-only access" }}</td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/manage/${$route.params.team}/api-keys/${apiKey.apiKey}`
                  "
                  aria-label="Details"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    title="Details"
                    class="icon"
                    icon="pencil-alt"
                    fixed-width
                  />
                </router-link>
                <button
                  aria-label="Delete"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = apiKey)"
                >
                  <font-awesome-icon
                    title="Delete"
                    class="icon"
                    icon="trash"
                    fixed-width
                  />
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
              title="Available"
              class="icon icon--ml-2 icon--color-light"
              icon="sync"
              spin
            />
          </button>
        </div>
      </div>
      <h2>Create API key</h2>
      <p>
        You can use API keys to programmatically access Staart in your
        applications.
      </p>
      <form @submit.prevent="createApiKey">
        <div class="fake-radio-container">
          <label>
            <input v-model="newApiKeyAccess" type="radio" :value="0" required />
            <span class="fake-radio" role="radio" tabindex="0" />
            <span class="name">Read-only access</span>
          </label>
        </div>
        <div class="fake-radio-container">
          <label>
            <input v-model="newApiKeyAccess" type="radio" :value="1" required />
            <span class="fake-radio" role="radio" tabindex="0" />
            <span class="name">Full access</span>
          </label>
        </div>
        <button class="button">Create API key</button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to delete this API key?</h2>
        <p>
          Deleting an API key is not reversible, and you'll need to update any
          apps using this key.
        </p>
        <button
          class="button button--color-danger-cta"
          @click="deleteApiKey(showDelete.apiKey)"
        >
          Yes, delete API key
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't delete
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPencilAlt,
  faArrowDown,
  faSync,
  faCloudDownloadAlt,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { ApiKeys, emptyPagination, ApiKey } from "../../../../types/manage";
library.add(faPencilAlt, faCloudDownloadAlt, faArrowDown, faSync, faTrash);

@Component({
  components: {
    Loading,
    Confirm,
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
  showDelete: ApiKey | null = null;
  loadingMore = false;
  loading = "";
  newApiKeyAccess = 0;

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
        access: this.newApiKeyAccess
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private deleteApiKey(key: string) {
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
