<template>
  <div>
    <h1 class="is-size-4">Passwords &amp; 2FA</h1>
    <h2 class="is-size-5" style="margin-top: 1rem">Change password</h2>
    <form @submit.prevent="save" style="margin: 0.5rem 0 1.5rem">
      <b-field label="Current password">
        <b-input
          type="password-reveal"
          v-model="currentPassword"
          password-reveal
          required
        />
      </b-field>
      <b-field label="New password">
        <b-input
          type="password-reveal"
          v-model="newPassword"
          password-reveal
          required
        />
      </b-field>
      <div class="password-strength">
        <div>Password strength</div>
        <b-progress
          :value="100 * (newPassword.length / 25)"
          size="is-small"
          :type="
            newPassword.length < 8
              ? 'is-danger'
              : newPassword.length < 20
              ? 'is-warning'
              : 'is-success'
          "
        />
      </div>
      <div style="margin-top: 0.5rem">
        <b-button type="is-primary" native-type="submit">
          Change password
        </b-button>
      </div>
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
  newPassword = "";
  currentPassword = "";
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

  async save() {
    this.loading = true;
    this.loading = false;
  }

  async remove2FA(id: number, email: string) {
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

<style>
.password-strength {
  display: flex;
  align-items: center;
}
.password-strength > div:last-child {
  flex: 1 0 0;
  margin-left: 1rem;
}
.password-strength .progress {
  height: 0.5rem;
}
</style>
