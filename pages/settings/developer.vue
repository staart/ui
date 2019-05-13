<template>
  <main>
    <Settings>
      <h2>API keys</h2>
      <p>
        You can switch which API key you are using Staart as here.
      </p>
      <Loading v-if="loading" :message="loading" />
      <div v-else>
        <div v-if="!apiKeys.length" class="card card--type-padded">
          <LargeMessage
            heading="No API keys"
            text="You don't have any API keys yet, let's change that."
          />
        </div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>API key</th>
              <th>Secret key</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(apiKey, index) in apiKeys"
              :key="`${apiKey.id}_${index}`"
            >
              <td>
                <code>{{ apiKey.apiKey }}</code>
              </td>
              <td>
                <code v-if="isVisible(apiKey.apiKey)">{{
                  apiKey.secretKey
                }}</code>
                <code v-else>••••••••••••••••••••</code>
              </td>
              <td><TimeAgo :date="apiKey.createdAt" /></td>
              <td class="text text--align-right">
                <button
                  v-if="isVisible(apiKey.apiKey)"
                  data-balloon="Hide secret key"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  @click="toggleApiKey(apiKey.apiKey)"
                >
                  <font-awesome-icon
                    title="Hide secret key"
                    icon="eye-slash"
                    fixed-width
                  />
                </button>
                <button
                  v-else
                  data-balloon="View secret key"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  @click="toggleApiKey(apiKey.apiKey)"
                >
                  <font-awesome-icon
                    title="View secret key"
                    icon="eye"
                    fixed-width
                  />
                </button>
                <button
                  data-balloon="Delete API key"
                  data-balloon-pos="up"
                  class="button button--color-danger button--type-icon"
                  @click="showDelete = apiKey"
                >
                  <font-awesome-icon
                    title="Delete API key"
                    class="icon icon--color-danger"
                    icon="trash"
                    fixed-width
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Create an API key</h2>
      <p>
        You can invite your team by creating an API key.
      </p>
      <Loading v-if="isCreating" message="Creating your API key" />
      <form v-else @submit.prevent="createApiKey">
        <button class="button">
          Create API key
        </button>
      </form>
    </Settings>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>
          Are you sure you want to delete this API key?
        </h2>
        <p>
          Deleting an API key is not reversible, and you'll have to ask an admin
          to add you again if you change your mind.
        </p>
        <button
          class="button button--color-danger-cta"
          @click="deleteApiKey(showDelete.apiKey)"
        >
          Yes, delete this API key
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
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import en from "@/locales/en";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Email } from "@/types/settings";
library.add(faTrash, faEye, faEyeSlash);

@Component({
  components: {
    LargeMessage,
    Settings,
    Loading,
    Input,
    TimeAgo,
    FontAwesomeIcon,
    Confirm
  },
  computed: mapGetters({
    apiKeys: "settings/apiKeys"
  })
})
export default class AccountSettings extends Vue {
  loading = "";
  isCreating = false;
  showDelete = null;
  visibleApiKeys: string[] = [];

  private mounted() {
    this.loading = "Loading your API keys";
    this.$store
      .dispatch("settings/getApiKeys")
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private deleteApiKey(id: string) {
    this.showDelete = null;
    this.loading = "Deleting API key";
    this.$store
      .dispatch("settings/deleteApiKey", id)
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private createApiKey() {
    this.isCreating = true;
    this.$store
      .dispatch("settings/createApiKey")
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.isCreating = false));
  }

  private toggleApiKey(apiKey: string) {
    if (this.visibleApiKeys.includes(apiKey)) {
      const index = this.visibleApiKeys.indexOf(apiKey);
      this.visibleApiKeys.splice(index, 1);
    } else {
      this.visibleApiKeys.push(apiKey);
    }
  }

  private isVisible(apiKey: string) {
    return this.visibleApiKeys.includes(apiKey);
  }
}
</script>

<style lang="scss" scoped></style>
