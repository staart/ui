<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Access tokens</h1>
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
        v-if="
          !loading &&
            (!accessTokens || !accessTokens.data || !accessTokens.data.length)
        "
        heading="No access tokens yet"
        img="undraw_software_engineer_lvl5.svg"
        text="Create an access token below"
      />
      <div
        v-else-if="
          accessTokens && accessTokens.data && accessTokens.data.length
        "
      >
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Access</th>
              <th>Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(accessToken, index) in accessTokens.data"
              :key="`${accessToken.id}_${index}`"
            >
              <td>{{ accessToken.name || "Unnamed access token" }}</td>
              <td v-if="accessToken.scopes">
                {{ accessToken.scopes.split(",").length }} API{{
                  accessToken.scopes.split(",").length === 1 ? "" : "s"
                }}
              </td>
              <td v-else>No APIs</td>
              <td><TimeAgo :date="accessToken.expiresAt" /></td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/users/${$route.params.slug}/access-tokens/${accessToken.id}`
                  "
                  aria-label="View"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon class="icon" icon="eye" fixed-width />
                </router-link>
                <button
                  aria-label="Delete"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = accessToken)"
                >
                  <font-awesome-icon class="icon" icon="trash" fixed-width />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="accessTokens && accessTokens.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more access tokens</span>
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
      <h2>Create access token</h2>
      <p>
        You can use access tokens to programmatically access your account. An
        access token is the same as your password, so make sure you keep it
        safe.
      </p>
      <form @submit.prevent="createAccessToken">
        <CheckList
          label="Permissions"
          :options="scopes"
          :value="newScopes"
          placeholder="Enter an IP address or CIDR, e.g., 192.168.1.1/42"
          @input="val => (newScopes = val)"
        />
        <button class="button">Create access token</button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
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
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSync,
  faTrash,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import CheckList from "@/components/form/CheckList.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { AccessTokens, emptyPagination, AccessToken } from "@/types/users";
import translations from "@/locales/en";
const scopes = translations.userScopes;
library.add(faArrowDown, faSync, faTrash, faEye);

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
  accessTokens: AccessTokens = emptyPagination;
  showDelete: AccessToken | null = null;
  loadingMore = false;
  loading = "";
  newScopes = "user:read";
  scopes = scopes;

  private created() {
    this.accessTokens = {
      ...this.$store.getters["users/accessTokens"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading your access tokens";
    this.$store
      .dispatch("users/getAccessTokens", { slug: this.$route.params.slug })
      .then(accessTokens => {
        this.accessTokens = { ...accessTokens };
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
      .dispatch("users/getAccessTokens", {
        slug: this.$route.params.slug,
        start: this.$store.state.users.accessTokens[this.$route.params.slug]
          .next
      })
      .then(() => {
        this.accessTokens = {
          ...this.$store.getters["users/accessTokens"](this.$route.params.slug)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private createAccessToken() {
    this.loading = "Creating your access token";
    this.$store
      .dispatch("users/createAccessToken", {
        slug: this.$route.params.slug,
        scopes: this.newScopes ? this.newScopes : undefined
      })
      .then(accessTokens => {
        this.accessTokens = { ...accessTokens };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newScopes = "";
      });
  }

  private deleteAccessToken(key: number) {
    this.showDelete = null;
    this.loading = "Deleting your access token";
    this.$store
      .dispatch("users/deleteAccessToken", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(accessTokens => {
        this.accessTokens = { ...accessTokens };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
