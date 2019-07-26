<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Active sessions</h1>
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
          !loading && (!sessions || !sessions.data || !sessions.data.length)
        "
        heading="No sessions yet"
        img="undraw_software_engineer_lvl5.svg"
        text="We couldn't find any other active sessions"
      />
      <div v-else-if="sessions && sessions.data && sessions.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Last used</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(session, index) in sessions.data"
              :key="`${session.id}_${index}`"
            >
              <td>
                <span>{{
                  parseUserAgent(session.userAgent).getBrowser().name
                }}</span>
                <span>{{
                  parseUserAgent(session.userAgent).getBrowser().major
                }}</span>
                on
                <span>{{
                  parseUserAgent(session.userAgent).getOS().name
                }}</span>
              </td>
              <td>
                <TimeAgo :date="session.updatedAt || session.createdAt" />
              </td>
              <td class="text text--align-right">
                <button
                  aria-label="Log out"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = session)"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="sign-out-alt"
                    fixed-width
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="sessions && sessions.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more sessions</span>
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
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want log out of this session?</h2>
        <p>
          We'll automatically log you out of this session in the next few
          minutes. You'll have to log in on that device again.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteSession(showDelete.id)"
        >
          Yes, log me out
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't leave
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
import UAParser from "ua-parser-js";
import {
  faArrowDown,
  faSync,
  faSignOutAlt,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Sessions, emptyPagination, Session } from "@/types/users";
library.add(
  faArrowDown,
  faSync,
  faSignOutAlt,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
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
  sessions: Sessions = emptyPagination;
  showDelete: Session | null = null;
  loadingMore = false;
  loading = "";
  newSession = "";

  private parseUserAgent(ua: string) {
    const parsed = new UAParser(ua);
    return parsed;
  }

  private created() {
    this.sessions = {
      ...this.$store.getters["users/sessions"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading your sessions";
    this.$store
      .dispatch("users/getSessions", { slug: this.$route.params.slug })
      .then(sessions => {
        this.sessions = { ...sessions };
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
      .dispatch("users/getSessions", {
        slug: this.$route.params.slug,
        start: this.$store.state.users.sessions[this.$route.params.slug].next
      })
      .then(() => {
        this.sessions = {
          ...this.$store.getters["users/sessions"](this.$route.params.slug)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private deleteSession(key: number) {
    this.showDelete = null;
    this.loading = "Logging out of this session";
    this.$store
      .dispatch("users/deleteSession", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(sessions => {
        this.sessions = { ...sessions };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
