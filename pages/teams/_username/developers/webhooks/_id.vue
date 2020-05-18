<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">
      <b-button
        tag="nuxt-link"
        :to="`/teams/${$route.params.username}/developers/webhooks`"
        icon-right="arrow-left"
        style="margin-right: 1rem"
      />
      <span>Webhook</span>
    </h1>
    <form @submit.prevent="save" style="margin: 0.5rem 0 1.5rem">
      <b-field label="URL">
        <b-input type="url" v-model="webhook.url" required />
      </b-field>
      <b-field label="Event">
        <b-select v-model="webhook.event" expanded required>
          <option
            v-for="(name, value) in webhooksData"
            :value="value"
            :key="`t${value}${name}`"
          >
            {{ name }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Content type">
        <b-select v-model="webhook.contentType" expanded required>
          <option>application/json</option>
          <option>text/plain</option>
        </b-select>
      </b-field>
      <b-field label="Secret">
        <b-input type="text" v-model="webhook.secret" />
      </b-field>
      <b-field>
        <b-checkbox v-model="webhook.isActive">
          Active
        </b-checkbox>
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingUpdate">
        Update webhook
      </b-button>
    </form>
    <h2 class="is-size-5">Danger zone</h2>
    <p style="margin: 1rem 0">
      If you don't want this webhook to trigger anymore, you can delete it.
    </p>
    <b-button
      type="is-danger"
      @click="
        deleteWebhook(webhook.id, webhooksData[webhook.event] || webhook.event)
      "
      :loading="loadingDelete"
    >
      Delete webhook
    </b-button>
    <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import webhooksData from "../../../../../data/webhooks.json";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersWebhooks extends Vue {
  loading = false;
  loadingUpdate = false;
  loadingDelete = false;
  webhook: any = {};
  webhooksData = webhooksData;

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/webhooks/${this.$route.params.id}`
      );
      this.webhook = data;
    } catch (error) {
      this.$router.push(
        `/organizations/${this.$route.params.username}/developers/webhooks`
      );
    }
    this.loading = false;
  }

  async save() {
    if (this.loadingUpdate) return;
    this.loadingUpdate = true;
    try {
      const { data } = await this.$axios.patch(
        `/organizations/${this.$route.params.username}/webhooks/${this.$route.params.id}`,
        {
          url: this.webhook.url,
          isActive: this.webhook.isActive,
        }
      );
      this.webhook = data.updated;
    } catch (error) {}
    this.loadingUpdate = false;
  }

  async deleteWebhook(id: number, webhook: string) {
    if (this.loadingDelete) return;
    this.$buefy.dialog.confirm({
      title: "Deleting webhook",
      message: `Are you sure you want to delete your webhook for <strong>${webhook}</strong>? This action is not reversible, and this webhook will stop triggering immediately.`,
      confirmText: "Yes, delete webhook",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingDelete = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/webhooks/${id}`
          );
        } catch (error) {}
        this.$router.push(
          `/teams/${this.$route.params.username}/developers/webhooks`
        );
      },
    });
  }
}
</script>
