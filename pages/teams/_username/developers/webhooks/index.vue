<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Webhooks</h1>
    <b-table
      :loading="loading"
      :data="webhooks.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="url" label="URL">
          <span>{{ truncate(props.row.url) }}</span>
          <b-tooltip v-if="props.row.isActive" label="Active">
            <b-icon icon="calendar-check" type="is-success" />
          </b-tooltip>
          <b-tooltip v-else label="Inactive">
            <b-icon icon="calendar-remove" type="is-danger" />
          </b-tooltip>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Event">
          {{ webhooksData[props.row.event] || props.row.event }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Edit">
            <b-button
              tag="nuxt-link"
              :to="
                `/teams/${$route.params.username}/developers/webhooks/${props.row.id}`
              "
              type="is-primary"
              icon-right="pencil"
              outlined
            />
          </b-tooltip>
          <b-tooltip label="Delete">
            <b-button
              type="is-danger"
              icon-right="delete"
              outlined
              @click="
                deleteWebhook(
                  props.row.id,
                  webhooksData[props.row.event] || props.row.event
                )
              "
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Create a webhook</h2>
    <p>
      You'll be able to add event restrictions and a secret key after creating
      the webhook.
    </p>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <div class="columns">
        <div class="column">
          <b-field label="URL">
            <b-input type="url" v-model="webhookUrl" required />
          </b-field>
        </div>
        <div class="column">
          <b-field label="Event">
            <b-select
              placeholder="Select an event"
              v-model="webhookEvent"
              expanded
              required
            >
              <option
                v-for="(name, value) in webhooksData"
                :value="value"
                :key="`t${value}${name}`"
              >
                {{ name }}
              </option>
            </b-select>
          </b-field>
        </div>
      </div>
      <b-button type="is-primary" native-type="submit" :loading="loadingCreate">
        Create webhook
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import webhooksData from "../../../../../data/webhooks.json";
import { truncate } from "../../../../../util/string";

@Component({
  middleware: "authenticated",
  layout: "teams",
})
export default class UsersWebhooks extends Vue {
  loading = false;
  loadingCreate = false;
  webhookUrl = "";
  webhookEvent = "*";
  webhooksData: any = webhooksData;
  webhooks: any = { data: [] };
  truncate = truncate;

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/webhooks`
      );
      this.webhooks = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingCreate = true;
    try {
      const { data } = await this.$axios.put(
        `/organizations/${this.$route.params.username}/webhooks`,
        {
          url: this.webhookUrl,
          event: this.webhookEvent,
        }
      );
      this.webhooks.data.push(data.added);
    } catch (error) {}
    this.webhookUrl = "";
    this.webhookEvent = "*";
    this.loadingCreate = false;
  }

  async deleteWebhook(id: number, webhook: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting webhook",
      message: `Are you sure you want to delete your webhook for <strong>${webhook}</strong>? This action is not reversible, and this webhook will stop triggering immediately.`,
      confirmText: "Yes, delete webhook",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/webhooks/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }
}
</script>
