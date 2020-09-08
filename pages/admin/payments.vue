<template>
  <div>
    <h1 class="is-size-4 mb-4">Payments</h1>
    <b-table
      :loading="loading"
      :data="payments.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <b-table-column v-slot="props" label="Category">
        {{ props.row.data.object.object }}
      </b-table-column>
      <b-table-column v-slot="props" label="Customer">
        <code v-if="props.row.data.object.customer">
          {{ props.row.data.object.customer }}
        </code>
        <span v-else><em>None</em></span>
      </b-table-column>
      <b-table-column v-slot="props" label="Previous attributes">
        {{ props.row.data.previous_attributes }}
      </b-table-column>
      <b-table-column v-slot="props" sortable field="createdAt" label="Created">
        {{ new Date(props.row.created * 1000).toLocaleDateString() }}
      </b-table-column>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="payments.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >
        Load more payments
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "admin"
})
export default class AdminPayments extends Vue {
  loading = false;
  payments: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/admin/payment-events${
          this.payments.data.length
            ? `?after=${this.payments.data[this.payments.data.length - 1].id}`
            : ""
        }`
      );
      this.payments.data.push(...(data.data || []));
      this.payments.hasMore = data.hasMore;
      this.payments = data;
    } catch (error) {}
    this.loading = false;
  }
}
</script>
