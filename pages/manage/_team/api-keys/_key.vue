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
      <form
        v-if="apiKey"
        v-meta-ctrl-enter="updateApiKey"
        @submit.prevent="updateApiKey"
      >
        <CommaList
          label="IP restrictions"
          :value="apiKey.ipRestrictions"
          placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
          @input="val => (apiKey.ipRestrictions = val)"
        />
        <CommaList
          label="Referrer restrictions"
          :value="apiKey.referrerRestrictions"
          placeholder="Enter a referrer URL, e.g., http*://*.example.com"
          @input="val => (apiKey.referrerRestrictions = val)"
        />
        <p><strong>Access</strong></p>
        <div class="fake-radio-container">
          <label>
            <input v-model="apiKey.access" type="radio" :value="0" required />
            <span class="fake-radio" role="radio" tabindex="0" />
            <span class="name">Read-only access</span>
          </label>
        </div>
        <div class="fake-radio-container">
          <label>
            <input v-model="apiKey.access" type="radio" :value="1" required />
            <span class="fake-radio" role="radio" tabindex="0" />
            <span class="name">Full access</span>
          </label>
        </div>
        <button class="button">Update API key</button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
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
        <button type="button" class="button" @click="showDelete = false">
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
import CommaList from "@/components/form/CommaList.vue";
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
library.add(faPencilAlt, faArrowDown, faSync, faTrash, faEye, faEyeSlash);

@Component({
  components: {
    Loading,
    Confirm,
    TimeAgo,
    CommaList,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  apiKeys: ApiKeys = emptyPagination;
  showDelete = false;
  loading = "";
  apiKey: ApiKey | null = null;

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
    this.loading = "Creating your API key";
    this.$store
      .dispatch("manage/updateApiKey", {
        team: this.$route.params.team,
        id: this.$route.params.key,
        ...this.apiKey
      })
      .then(apiKeys => {
        this.apiKeys = { ...apiKeys };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
      });
  }

  private deleteApiKey(key: string) {
    this.showDelete = false;
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
