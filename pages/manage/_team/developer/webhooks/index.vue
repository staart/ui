<template>
  <main>
    <div>
      <div class="row">
        <h1>Webhooks</h1>
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
        v-if="
          !loading && (!webhooks || !webhooks.data || !webhooks.data.length)
        "
        heading="No Webhooks yet"
        img="undraw_software_engineer_lvl5.svg"
        text="Create a webhook below"
      />
      <div v-else-if="webhooks && webhooks.data && webhooks.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Created</th>
              <th>Last fired</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(webhook, index) in webhooks.data"
              :key="`${webhook.id}_${index}`"
            >
              <td>
                <span>{{ events[webhook.event] || webhook.event }}</span>
                <span
                  v-if="webhook.isActive"
                  aria-label="Active"
                  data-balloon-pos="up"
                >
                  <font-awesome-icon
                    class="icon icon--ml-2 icon--color-success"
                    icon="check-circle"
                  />
                </span>
              </td>
              <td><TimeAgo :date="webhook.createdAt" /></td>
              <td v-if="webhook.lastFiredAt">
                <TimeAgo :date="webhook.lastFiredAt" />
              </td>
              <td v-else>Never</td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/manage/${$route.params.team}/developer/webhooks/${webhook.id}`
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
                  @click="() => (showDelete = webhook)"
                >
                  <font-awesome-icon class="icon" icon="trash" fixed-width />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="webhooks && webhooks.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more Webhooks</span>
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
      <div v-if="loggedInMembership !== 3 && loggedInMembership !== 4">
        <h2>Create webhook</h2>
        <p>
          You can use webhooks to get access to events in your developer
          applications.
        </p>
        <form v-meta-ctrl-enter="createWebhook" @submit.prevent="createWebhook">
          <Select
            :value="newHookEvent"
            label="Event"
            :options="events"
            required
            @input="val => (newHookEvent = val)"
          />
          <Input
            :value="newHookUrl"
            label="URL"
            type="url"
            placeholder="Enter the complete URL to your hook"
            required
            @input="val => (newHookUrl = val)"
          />
          <p class="text text--color-muted text--size-small">
            You can add a secret key and content type after creating the
            webhook.
          </p>
          <button class="button">Add webhook</button>
        </form>
      </div>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to delete this webhook?</h2>
        <p>
          Deleting a webhook is not reversible, and we'll immediately stop
          firing this webbook.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteWebhook(showDelete.id)"
        >
          Yes, delete Webhook
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
  faPencilAlt,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Webhooks, emptyPagination, Webhook } from "@/types/manage";
import translations from "@/locales/en";
const events = translations.webhooks;
library.add(faArrowDown, faSync, faTrash, faPencilAlt, faCheckCircle);

@Component({
  components: {
    Loading,
    Confirm,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  webhooks: Webhooks = emptyPagination;
  showDelete: Webhook | null = null;
  loadingMore = false;
  loading = "";
  newHookUrl = "";
  newHookEvent = "*";
  events = events;
  loggedInMembership = 3;

  private created() {
    this.loggedInMembership = parseInt(
      this.$store.getters["manage/loggedInMembership"](this.$route.params.team)
    );
    this.webhooks = {
      ...this.$store.getters["manage/webhooks"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your webhooks";
    this.$store
      .dispatch("manage/getWebhooks", { team: this.$route.params.team })
      .then(webhooks => {
        this.webhooks = { ...webhooks };
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
      .dispatch("manage/getWebhooks", {
        team: this.$route.params.team,
        start: this.$store.state.manage.webhooks[this.$route.params.team].next
      })
      .then(() => {
        this.webhooks = {
          ...this.$store.getters["manage/webhooks"](this.$route.params.team)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private createWebhook() {
    this.loading = "Creating your webhook";
    this.$store
      .dispatch("manage/createWebhook", {
        team: this.$route.params.team,
        event: this.newHookEvent,
        url: this.newHookUrl
      })
      .then(webhooks => {
        this.webhooks = { ...webhooks };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newHookUrl = "";
      });
  }

  private deleteWebhook(key: number) {
    this.showDelete = null;
    this.loading = "Deleting your webhook";
    this.$store
      .dispatch("manage/deleteWebhook", {
        team: this.$route.params.team,
        id: key
      })
      .then(webhooks => {
        this.webhooks = { ...webhooks };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
