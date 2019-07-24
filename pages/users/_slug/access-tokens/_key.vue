<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <div>
          <nuxt-link
            :to="`/users/${$route.params.slug}/access-tokens`"
            aria-label="Back"
            data-balloon-pos="down"
            class="button button--type-icon button--type-back"
          >
            <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
          </nuxt-link>
          <h1>Access tokens</h1>
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
      <div v-if="accessToken">
        <h2>Use access token</h2>
        <Input
          label="Access token"
          :value="accessToken.jwtAccessToken"
          disabled
        />
        <button class="button" @click="copy(accessToken.jwtAccessToken)">
          <font-awesome-icon class="icon icon--mr-1" icon="copy" />
          <span v-if="copied">Copied</span>
          <span v-else>Copy</span>
        </button>
        <button
          type="button"
          class="button button--color-danger"
          style="margin-left: 0.5rem"
          @click.prevent="showDelete = accessToken"
        >
          <font-awesome-icon class="icon icon--mr-1" icon="trash" />
          <span>Delete</span>
        </button>
        <h2>Edit access token</h2>
        <form
          v-meta-ctrl-enter="() => (showUpdate = true)"
          @submit.prevent="() => (showUpdate = true)"
        >
          <Input
            label="Name"
            placeholder="Enter a name for this access token"
            :value="accessToken.name"
            @input="val => (accessToken.name = val)"
          />
          <CheckList
            label="Permissions"
            :options="scopes"
            :value="accessToken.scopes"
            @input="val => (accessToken.scopes = val)"
          />
          <button class="button">Update access token</button>
        </form>
      </div>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>Are you sure you want to delete this access token?</h2>
        <p>
          Deleting an access token is not reversible, and you'll need to update
          any apps using this key.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteAccessToken(showDelete.id)"
        >
          Yes, delete access token
        </button>
        <button type="button" class="button" @click="showDelete = false">
          No, don't delete
        </button>
      </Confirm>
    </transition>
    <transition name="modal">
      <Confirm v-if="showUpdate" :on-close="() => (showUpdate = false)">
        <h2>
          Are you sure you want to update and regenerate this access token?
        </h2>
        <p>
          Updating your access token will generate a new access token, so you'll
          have to update it wherever you're using it.
        </p>
        <p>The current access token will stop working instantly.</p>
        <button
          class="button button--color-primary button--state-cta"
          @click="updateAccessToken"
        >
          Yes, regenerate access token
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
import { AccessTokens, emptyPagination, AccessToken } from "@/types/users";
import translations from "@/locales/en";
import { removeNulls } from "@/helpers/crud";
const scopes = translations.userScopes;
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
  accessTokens: AccessTokens = emptyPagination;
  showDelete = false;
  showUpdate = false;
  loading = "";
  accessToken: AccessToken | null = null;
  scopes = scopes;
  copied = false;

  private created() {
    this.accessTokens = {
      ...this.$store.getters["users/accessTokens"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading your access tokens";
    this.$store
      .dispatch("users/getAccessToken", {
        slug: this.$route.params.slug,
        id: this.$route.params.key
      })
      .then(accessToken => {
        this.accessToken = { ...accessToken };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private updateAccessToken() {
    this.showUpdate = false;
    this.loading = "Updating your access token";
    const accessToken = { ...this.accessToken };
    if (accessToken) {
      [
        "jwtAccessToken",
        "userId",
        "expiresAt",
        "createdAt",
        "updatedAt"
      ].forEach(k => delete accessToken[k]);
    }
    this.$store
      .dispatch("users/updateAccessToken", {
        slug: this.$route.params.slug,
        id: this.$route.params.key,
        ...accessToken
      })
      .then(accessToken => {
        this.accessToken = { ...accessToken };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
      });
  }

  private deleteAccessToken(key: number) {
    this.showDelete = false;
    this.loading = "Deleting your access token";
    this.$store
      .dispatch("users/deleteAccessToken", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(accessTokens => {
        this.accessTokens = { ...accessTokens };
        this.$router.push(`/users/${this.$route.params.slug}/access-tokens`);
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
