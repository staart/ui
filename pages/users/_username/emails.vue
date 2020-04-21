<template>
  <div>
    <h1 class="is-size-4">Emails</h1>
    <b-table
      :loading="loading"
      :data="emails.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <template slot-scope="props">
        <b-table-column sortable field="email" label="Email">
          {{ props.row.email }}
          <b-tooltip v-if="props.row.isVerified" label="Verified">
            <b-icon icon="check-circle" type="is-success" />
          </b-tooltip>
          <b-tooltip v-else label="Unverified">
            <b-icon icon="alert" type="is-warning" />
          </b-tooltip>
        </b-table-column>
        <b-table-column sortable field="createdAt" label="Added">
          {{ new Date(props.row.createdAt).toLocaleDateString() }}
        </b-table-column>
        <b-table-column class="has-text-right">
          <b-tooltip label="Delete">
            <b-button
              type="is-danger"
              icon-right="delete"
              @click="deleteEmail(props.row.id, props.row.email)"
            />
          </b-tooltip>
        </b-table-column>
      </template>
    </b-table>
    <h2 class="is-size-5" style="margin-top: 1rem">Add another email</h2>
    <form @submit.prevent="add" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Email">
        <b-input type="email" v-model="newEmail" required />
      </b-field>
      <b-button type="is-primary" native-type="submit">
        Update settings
      </b-button>
      <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </form>
    <h2 class="is-size-5">Email preferences</h2>
    <p>primary email, notification emails</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "users"
})
export default class UsersEmails extends Vue {
  newEmail = "";
  loading = false;
  emails: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    const { data }: { data: any } = await this.$axios.get(
      `/users/${this.$route.params.username}/emails`
    );
    this.emails = data;
    this.loading = false;
  }

  async add() {
    this.loading = true;
    const { data } = await this.$axios.put(
      `/users/${this.$route.params.username}/emails`,
      {
        email: this.newEmail
      }
    );
    this.emails.data.push(data.added);
    this.newEmail = "";
    this.loading = false;
  }

  async deleteEmail(id: number, email: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting email",
      message: `Are you sure you want to delete your email <code>${email}</code>? This action is not reversible, and you'll have to verify this email again if you change your mind.`,
      confirmText: "Yes, delete email",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        await this.$axios.delete(
          `/users/${this.$route.params.username}/emails/${id}`
        );
        return this.get();
      }
    });
  }
}
</script>
