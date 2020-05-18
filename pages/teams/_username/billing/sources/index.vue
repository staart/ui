<template>
  <div>
    <h1 class="is-size-4" style="margin-bottom: 1rem">Payment methods</h1>
    <b-table
      :loading="loading"
      :data="sources.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="name" label="Name">
          {{ props.row }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Edit">
            <b-button
              tag="nuxt-link"
              :to="
                `/teams/${$route.params.username}/developers/sources/${props.row.id}`
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
                deleteApiKey(props.row.id, props.row.name || 'Unnamed source')
              "
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Add a credit card</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <card
        class="stripe-card"
        :class="{ complete }"
        :stripe="stripeKey"
        :options="stripeOptions"
        @change="complete = $event.complete"
      />
      <b-button type="is-primary" native-type="submit" :loading="loadingCreate">
        Create source
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { stripeKey, stripeOptions } from "../../../../../data/stripe.json";
const { Card, createToken } = require("vue-stripe-elements-plus");

@Component({
  middleware: "authenticated",
  layout: "teams",
  components: {
    Card,
  },
})
export default class UsersApiKeys extends Vue {
  loading = false;
  loadingCreate = false;
  complete = false;
  stripeOptions = stripeOptions;
  stripeKey = stripeKey;
  sources: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/organizations/${this.$route.params.username}/sources`
      );
      this.sources = data;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingCreate = true;
    const token = await createToken();
    const message = token?.error?.message;
    if (message) {
      this.$buefy.toast.open({
        message,
        type: "is-danger",
      });
      this.loadingCreate = false;
      return;
    }
    console.log(token);
    try {
      const { data } = await this.$axios.put(
        `/organizations/${this.$route.params.username}/sources`,
        {
          object: "card",
          id: token.token.card.id,
        }
      );
      this.sources.data.push(data.added);
      this.get();
    } catch (error) {}
    this.loadingCreate = false;
  }

  async deleteApiKey(id: number, source: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting source",
      message: `Are you sure you want to delete your source <strong>${source}</strong>? This action is not reversible, and this source will stop working immediately.`,
      confirmText: "Yes, delete source",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/organizations/${this.$route.params.username}/sources/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }
}
</script>
