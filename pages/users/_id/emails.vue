<template>
  <div>
    <h1 class="is-size-4 mb-4">Emails</h1>
    <b-table
      :loading="loading"
      :data="emails.data"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <b-table-column v-slot="props" sortable field="email" label="Email">
        {{ props.row.email }}
        <b-tooltip v-if="props.row.isVerified" label="Verified">
          <b-icon icon="check-circle" type="is-success" />
        </b-tooltip>
        <b-tooltip v-else label="Unverified">
          <b-icon icon="alert" type="is-warning" />
        </b-tooltip>
      </b-table-column>
      <b-table-column v-slot="props" sortable field="createdAt" label="Added">
        {{
        new Date(props.row.createdAt).toLocaleDateString()
        }}
      </b-table-column>
      <b-table-column v-slot="props" cell-class="has-text-right">
        <b-tooltip label="Delete">
          <b-button
            type="is-danger"
            icon-right="delete"
            @click="deleteEmail(props.row.id, props.row.email)"
          />
        </b-tooltip>
      </b-table-column>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="emails.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >Load more emails</b-button>
    </div>
    <h2 class="is-size-5 mb-3 mt-5">Add email</h2>
    <form @submit.prevent="add">
      <b-field label="Email">
        <b-input type="email" v-model="newEmail" required />
      </b-field>
      <b-button
        type="is-primary"
        native-type="submit"
        :loading="loadingAdd"
        icon-left="email-plus"
      >Add email</b-button>
    </form>
    <h2 class="is-size-5 mb-3 mt-5">Email preferences</h2>
    <form @submit.prevent="save">
      <b-field label="Primary email" message="We'll send you emails only on your primary email">
        <b-select v-model="prefersEmailId" expanded>
          <option
            v-for="(email, i) in emails.data"
            :key="`e${email.id}${i}`"
            :value="email.id"
          >{{ email.email }}</option>
        </b-select>
      </b-field>
      <b-field label="Notification emails">
        <div>
          <b-radio
            name="radioNotificationEmails"
            native-value="ACCOUNT"
            v-model="notificationEmails"
          >Account and security</b-radio>
          <b-radio
            name="radioNotificationEmails"
            native-value="UPDATES"
            v-model="notificationEmails"
          >App updates</b-radio>
          <b-radio
            name="radioNotificationEmails"
            native-value="PROMOTIONS"
            v-model="notificationEmails"
          >Promotions</b-radio>
        </div>
      </b-field>
      <b-button
        type="is-primary"
        native-type="submit"
        :loading="loadingSave"
        icon-left="email-check"
      >Update settings</b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "users",
})
export default class UsersEmails extends Vue {
  newEmail = "";
  loading = false;
  loadingAdd = false;
  loadingSave = false;
  prefersEmailId = 0;
  notificationEmails = "ACCOUNT";
  emails: any = { data: [] };

  async created() {
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.id}/emails?take=10${
          this.emails.data.length
            ? `&after=${this.emails.data[this.emails.data.length - 1].id}`
            : ""
        }`
      );
      this.emails.data.push(...(data.data || []));
      this.emails.hasMore = data.hasMore;
      this.emails = data;
    } catch (error) {}
    try {
      const user = await this.$axios.get(`/users/${this.$route.params.id}`);
      this.notificationEmails = user.data.notificationEmails;
      this.prefersEmailId = user.data.prefersEmailId;
    } catch (error) {}
    this.loading = false;
  }

  async add() {
    this.loadingAdd = true;
    try {
      const { data } = await this.$axios.put(
        `/users/${this.$route.params.id}/emails`,
        {
          email: this.newEmail,
        }
      );
      this.emails.data.push(data.added);
      this.newEmail = "";
    } catch (error) {}
    this.loadingAdd = false;
  }

  async save() {
    this.loadingSave = true;
    try {
      await this.$axios.patch(`/users/${this.$route.params.id}`, {
        primaryEmail: this.prefersEmailId,
        notificationEmails: this.notificationEmails,
      });
    } catch (error) {}
    this.loadingSave = false;
  }

  async deleteEmail(id: number, email: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting email",
      message: `Are you sure you want to delete your email <strong>${email}</strong>? This action is not reversible, and you'll have to verify this email again if you change your mind.`,
      confirmText: "Yes, delete email",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(
            `/users/${this.$route.params.id}/emails/${id}`
          );
        } catch (error) {}
        return this.get();
      },
    });
  }
}
</script>
