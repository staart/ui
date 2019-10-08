<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Connected accounts</h1>
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
            (!identities || !identities.data || !identities.data.length)
        "
        heading="No identities yet"
        img="undraw_software_engineer_lvl5.svg"
        text="We couldn't find connected identities"
      />
      <div v-else-if="identities && identities.data && identities.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Identity</th>
              <th>Connected</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(identity, index) in identities.data"
              :key="`${identity.id}_${index}`"
            >
              <td>{{ serviceIdentities[identity.type] || identity.type }}</td>
              <td>{{ identity.loginName }}</td>
              <td>
                <TimeAgo :date="identity.createdAt" />
              </td>
              <td class="text text--align-right">
                <button
                  aria-label="Log out"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = identity)"
                >
                  <font-awesome-icon class="icon" icon="trash" fixed-width />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="identities && identities.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more identities</span>
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
      <h2>Connect an identity</h2>
      <p>
        You can add all your third-party accounts here.
      </p>
      <form>
        <button
          class="button button--type-identity"
          @click.prevent="getOAuthLink('github')"
        >
          <font-awesome-icon class="icon" :icon="['fab', 'github']" />
          <span>GitHub</span>
        </button>
        <button
          class="button button--type-identity"
          @click.prevent="getOAuthLink('microsoft')"
        >
          <font-awesome-icon class="icon" :icon="['fab', 'microsoft']" />
          <span>Microsoft</span>
        </button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to remove this identity?</h2>
        <p>
          We'll un-link this connected account and you won't be able to log in
          using this identity again.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteIdentity(showDelete.id)"
        >
          Yes, un-link account
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't un-link
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
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Identities, emptyPagination, Identity } from "@/types/users";
import en from "@/locales/en";
const serviceIdentities = en.serviceIdentities;
library.add(
  faArrowDown,
  faSync,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen,
  faGithub,
  faMicrosoft
);

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
  identities: Identities = emptyPagination;
  showDelete: Identity | null = null;
  serviceIdentities = serviceIdentities;
  loadingMore = false;
  loading = "";
  newIdentity = "";

  private created() {
    this.identities = {
      ...this.$store.getters["users/identities"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading your identities";
    this.$store
      .dispatch("users/getIdentities", { slug: this.$route.params.slug })
      .then(identities => {
        this.identities = { ...identities };
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
      .dispatch("users/getIdentities", {
        slug: this.$route.params.slug,
        start: this.$store.state.users.identities[this.$route.params.slug].next
      })
      .then(() => {
        this.identities = {
          ...this.$store.getters["users/identities"](this.$route.params.slug)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private deleteIdentity(key: number) {
    this.showDelete = null;
    this.loading = "Deleting this identity";
    this.$store
      .dispatch("users/deleteIdentity", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(identities => {
        this.identities = { ...identities };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private async getOAuthLink(service: string) {
    this.loading = "Connecting your account";
    const data = await this.$axios.put(
      `/users/${this.$route.params.slug}/identities`,
      {
        service
      }
    );
    location.replace(data.data.url);
  }
}
</script>

<style lang="scss" scoped>
.button--type-identity {
  width: 7rem;
  .icon {
    font-size: 200%;
    margin-bottom: 1rem;
  }
  > span {
    display: block;
  }
  margin-right: 1rem;
  margin-bottom: 1rem;
}
</style>
