<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <div>
          <nuxt-link
            :to="`/manage/${$route.params.team}/developer/webhooks`"
            aria-label="Back"
            data-balloon-pos="down"
            class="button button--type-icon button--type-back"
          >
            <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
          </nuxt-link>
          <h1>Webhook</h1>
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
      <div v-if="webhook">
        <form v-meta-ctrl-enter="updateWebhook" @submit.prevent="updateWebhook">
          <Select
            :value="webhook.event"
            label="Event"
            :options="events"
            required
            @input="val => (webhook.event = val)"
          />
          <Input
            label="URL"
            placeholder="Enter a URL for this webhook"
            :value="webhook.url"
            @input="val => (webhook.url = val)"
          />
          <Select
            :value="webhook.contentType"
            label="Content type"
            :options="['application/json', 'application/x-www-form-urlencoded']"
            required
            @input="val => (webhook.contentType = val)"
          />
          <Input
            label="Secret"
            placeholder="Enter a secret key for this webhook"
            :value="webhook.secret"
            @input="val => (webhook.secret = val)"
          />
          <Checkbox
            :value="webhook.isActive"
            label="Activate this webhook"
            @input="val => (webhook.isActive = val)"
          />
          <button class="button">Update webhook</button>
          <button
            class="button button--color-danger"
            type="button"
            style="margin-left: 0.5rem"
            @click="() => (showDelete = true)"
          >
            <font-awesome-icon class="icon icon--mr-1" icon="trash" />
            <span>Delete webhook</span>
          </button>
        </form>
      </div>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
        <h2>Are you sure you want to delete this webhook?</h2>
        <p>
          Deleting an webhook is not reversible, and we'll immediately stop
          firing this webbook.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteWebhook(showDelete.id)"
        >
          Yes, delete webhook
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
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPencilAlt,
  faArrowDown,
  faSync,
  faTrash,
  faArrowLeft,
  faCopy
} from "@fortawesome/free-solid-svg-icons";
import copy from "copy-to-clipboard";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Webhooks, emptyPagination, Webhook } from "@/types/manage";
import translations from "@/locales/en";
const events = translations.webhooks;
library.add(faPencilAlt, faArrowDown, faSync, faTrash, faCopy, faArrowLeft);

@Component({
  components: {
    Loading,
    Confirm,
    Input,
    TimeAgo,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  webhooks: Webhooks = emptyPagination;
  showDelete = false;
  loading = "";
  webhook: Webhook | null = null;
  events = events;
  copied = false;

  private created() {
    this.webhooks = {
      ...this.$store.getters["manage/webhooks"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your webhooks";
    this.$store
      .dispatch("manage/getWebhook", {
        team: this.$route.params.team,
        id: this.$route.params.key
      })
      .then(webhook => {
        this.webhook = { ...webhook };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private updateWebhook() {
    this.loading = "Updating your webhook";
    const webhook = { ...this.webhook };
    this.$store
      .dispatch("manage/updateWebhook", {
        team: this.$route.params.team,
        id: this.$route.params.key,
        ...webhook
      })
      .then(webhook => {
        this.webhook = { ...webhook };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
      });
  }

  private deleteWebhook(key: number) {
    this.showDelete = false;
    this.loading = "Deleting your webhook";
    this.$store
      .dispatch("manage/deleteWebhook", {
        team: this.$route.params.team,
        id: key
      })
      .then(webhooks => {
        this.webhooks = { ...webhooks };
        this.$router.push(
          `/manage/${this.$route.params.team}/developer/webhooks`
        );
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
