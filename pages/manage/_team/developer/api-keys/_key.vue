<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <div>
          <nuxt-link
            :to="`/manage/${$route.params.team}/developer/api-keys`"
            aria-label="Back"
            data-balloon-pos="down"
            class="button button--type-icon button--type-back"
          >
            <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
          </nuxt-link>
          <h1>API key</h1>
        </div>
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
      <div v-if="apiKey">
        <h2>Use API key</h2>
        <Input label="API key" :value="apiKey.jwtApiKey" disabled />
        <button class="button" @click="copy(apiKey.jwtApiKey)">
          <font-awesome-icon class="icon icon--mr-1" icon="copy" />
          <span v-if="copied">Copied</span>
          <span v-else>Copy</span>
        </button>
        <button
          type="button"
          class="button button--color-danger"
          style="margin-left: 0.5rem"
          @click.prevent="showDelete = apiKey"
        >
          <font-awesome-icon class="icon icon--mr-1" icon="trash" />
          <span>Delete</span>
        </button>
        <h2>Edit API key</h2>
        <form
          v-meta-ctrl-enter="() => (showUpdate = true)"
          @submit.prevent="() => (showUpdate = true)"
        >
          <Input
            label="Name"
            placeholder="Enter a name for this API key"
            :value="apiKey.name"
            @input="val => (apiKey.name = val)"
          />
          <CheckList
            label="API restrictions"
            :options="scopes"
            :value="apiKey.scopes"
            @input="val => (apiKey.scopes = val)"
          />
          <CommaList
            label="IP restrictions"
            :value="apiKey.ipRestrictions"
            placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
            @input="val => (apiKey.ipRestrictions = val)"
          />
          <CommaList
            label="Referrer restrictions"
            :value="apiKey.referrerRestrictions"
            placeholder="Enter a host name without protocol, e.g., example.com"
            @input="val => (apiKey.referrerRestrictions = val)"
          />
          <button class="button">Update API key</button>
        </form>
      </div>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
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
        <button type="button" class="button" @click="showDelete = false">
          No, don't delete
        </button>
      </Confirm>
    </transition>
    <transition name="modal">
      <Confirm v-if="showUpdate" :on-close="() => (showUpdate = false)">
        <h2>Are you sure you want to update and regenerate this API key?</h2>
        <p>
          Updating your API key will generate a new API key, so you'll have to
          update it wherever you're using it.
        </p>
        <p>The current API key will stop working instantly.</p>
        <button
          class="button button--color-primary button--state-cta"
          @click="updateApiKey"
        >
          Yes, regenerate API key
        </button>
        <button type="button" class="button" @click="showUpdate = false">
          No, don't update
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPencilAlt,
  faArrowDown,
  faSync,
  faTrash,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faCopy
} from "@fortawesome/free-solid-svg-icons";
import copy from "copy-to-clipboard";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import CheckList from "@/components/form/CheckList.vue";
import CommaList from "@/components/form/CommaList.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { ApiKeys, emptyPagination, ApiKey } from "@/types/manage";
import translations from "@/locales/en";
import { removeNulls } from "@/helpers/crud";
const scopes = translations.scopes;
library.add(
  faPencilAlt,
  faArrowDown,
  faSync,
  faTrash,
  faCopy,
  faEye,
  faEyeSlash,
  faArrowLeft
);

@Component({
  components: {
    Loading,
    Confirm,
    Input,
    TimeAgo,
    CommaList,
    FontAwesomeIcon,
    CheckList,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  apiKeys: ApiKeys = emptyPagination;
  showDelete = false;
  showUpdate = false;
  loading = "";
  apiKey: ApiKey | null = null;
  scopes = scopes;
  copied = false;

  private created() {
    this.apiKeys = {
      ...this.$store.getters["manage/apiKeys"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your API keys";
    this.$store
      .dispatch("manage/getApiKey", {
        team: this.$route.params.team,
        id: this.$route.params.key
      })
      .then(apiKey => {
        this.apiKey = { ...apiKey };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private updateApiKey() {
    this.showUpdate = false;
    this.loading = "Updating your API key";
    const apiKey = { ...this.apiKey };
    if (apiKey) {
      [
        "jwtApiKey",
        "organizationId",
        "expiresAt",
        "createdAt",
        "updatedAt"
      ].forEach(k => delete apiKey[k]);
    }
    this.$store
      .dispatch("manage/updateApiKey", {
        team: this.$route.params.team,
        id: this.$route.params.key,
        ...apiKey
      })
      .then(apiKey => {
        this.apiKey = { ...apiKey };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
      });
  }

  private deleteApiKey(key: number) {
    this.showDelete = false;
    this.loading = "Deleting your API key";
    this.$store
      .dispatch("manage/deleteApiKey", {
        team: this.$route.params.team,
        id: key
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
        this.$router.push(`/manage/${this.$route.params.team}/api-keys`);
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private copy(text: string) {
    copy(text);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 3000);
  }
}
</script>

<style lang="scss" scoped></style>
