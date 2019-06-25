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
            <font-awesome-icon class="icon" icon="sync" fixed-width />
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
                <code v-if="!revealed.includes(apiKey.apiKey)"
                  >····················</code
                >
                <code v-else>{{ apiKey.secretKey }}</code>
              </td>
              <td v-if="apiKey.apiRestrictions">
                {{ apiKey.apiRestrictions.split(",").length }} API{{
                  apiKey.apiRestrictions.split(",").length === 1 ? "" : "s"
                }}
              </td>
              <td v-else>All APIs</td>
              <td class="text text--align-right">
                <button
                  v-if="!revealed.includes(apiKey.apiKey)"
                  aria-label="Reveal secret key"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  @click="() => (showReveal = apiKey)"
                >
                  <font-awesome-icon class="icon" icon="eye" fixed-width />
                </button>
                <button
                  v-else
                  aria-label="Hide secret key"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  @click="hideApiKey(apiKey.apiKey)"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="eye-slash"
                    fixed-width
                  />
                </button>
                <router-link
                  :to="
                    `/manage/${$route.params.team}/api-keys/${apiKey.apiKey}`
                  "
                  aria-label="Edit"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
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
      <h2>Create API key</h2>
      <p>
        You can use API keys to programmatically access Staart in your
        applications.
      </p>
      <form @submit.prevent="createApiKey">
        <CheckList
          label="API restrictions"
          :options="apiRestrictions"
          :value="newApiRestrictions"
          placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
          @input="val => (newApiRestrictions = val)"
        />
        <p class="text text--color-muted text--size-small">
          You can add IP and referrer restrictions after creating the API key.
        </p>
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
          class="button button--color-danger button--state-cta"
          @click="deleteApiKey(showDelete.apiKey)"
        >
          Yes, delete API key
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't delete
        </button>
      </Confirm>
    </transition>
    <transition name="modal">
      <Confirm v-if="showReveal" :on-close="() => (showReveal = null)">
        <h2>Are you sure you want to reveal this secret key?</h2>
        <p>
          Your secret key is like your password. Anyone with access to it can
          make changes to your account including charging your credit card.
        </p>
        <button
          class="button button--color-primary"
          @click="
            () => {
              revealed.push(showReveal.apiKey);
              showReveal = null;
            }
          "
        >
          Yes, reveal secret key
        </button>
        <button type="button" class="button" @click="showReveal = null">
          No, don't reveal
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
import CheckList from "@/components/form/CheckList.vue";
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
  faTrash,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import { ApiKeys, emptyPagination, ApiKey } from "@/types/manage";
import translations from "@/locales/en";
const apiRestrictions = translations.apiRestrictions;
library.add(faPencilAlt, faArrowDown, faSync, faTrash, faEye, faEyeSlash);

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
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  apiKeys: ApiKeys = emptyPagination;
  showDelete: ApiKey | null = null;
  showReveal: ApiKey | null = null;
  revealed: string[] = [];
  loadingMore = false;
  loading = "";
  newApiRestrictions = "orgRead";
  apiRestrictions = apiRestrictions;

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
        apiRestrictions: this.newApiRestrictions
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newApiRestrictions = "";
      });
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

  private hideApiKey(apiKey: string) {
    const index = this.revealed.indexOf(apiKey);
    if (index > -1) {
      this.revealed.splice(index, 1);
    }
    this.showReveal = null;
  }
}
</script>

<style lang="scss" scoped></style>
