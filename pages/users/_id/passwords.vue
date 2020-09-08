<template>
  <div>
    <h1 class="is-size-4 mb-4">Passwords &amp; 2FA</h1>
    <h2 class="is-size-5 mb-3">Change password</h2>
    <form @submit.prevent="save">
      <b-field label="Current password" v-if="hasPassword">
        <b-input type="password" v-model="oldPassword" password-reveal required />
      </b-field>
      <b-field label="New password">
        <b-input type="password" v-model="newPassword" password-reveal required />
      </b-field>
      <div class="password-strength mt-3 mb-3">
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
      <div>
        <b-button
          type="is-primary"
          native-type="submit"
          :loading="loadingPassword"
          icon-left="key-variant"
        >Change password</b-button>
      </div>
    </form>
    <h2 class="is-size-5 mb-3 mt-5">Two-factor authentication</h2>
    <div v-if="twoFactorEnabled">
      <b-message type="is-success" has-icon>
        2FA adds an additional layer of protection in your account. You have 2FA
        <strong>enabled</strong>
        and have used {{ backupCodesUsed }}/{{ backupCodesAll }}
        backup codes.
      </b-message>
      <div class="buttons mt-3">
        <b-button
          type="is-danger"
          @click="disable"
          :loading="loading"
          icon-left="lock-open"
        >Disable 2FA</b-button>
        <b-button
          @click="regenerate"
          :loading="loadingRegenerate"
          icon-left="backup-restore"
        >Regenerate backup codes</b-button>
      </div>
    </div>
    <div v-else>
      <p>
        2FA adds an additional layer of protection in your account. You'll need
        to have a TOTP app like Google Authenticator or a password manager like
        1Password to use 2FA.
      </p>
      <div class="buttons mt-3">
        <b-button type="is-success" @click="enable" :loading="loading" icon-left="lock">Enable 2FA</b-button>
      </div>
    </div>
    <b-modal :width="300" :active.sync="showQrCode">
      <div class="card">
        <div class="card-content">
          <p class="image is-square">
            <img :src="qrCode" />
          </p>
          <p class="mt-3">
            Scan this QR code in your authenticator app and enter the one-time
            password (OTP).
          </p>
          <form @submit.prevent="verify" class="mt-4">
            <b-field label="One-time password">
              <b-input
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model="verificationCode"
                required
              />
            </b-field>
            <div class="buttons">
              <b-button
                type="is-primary"
                native-type="submit"
                :loading="loading"
                icon-left="lock-open"
              >Enable 2FA</b-button>
            </div>
          </form>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "users",
})
export default class UsersEmails extends Vue {
  oldPassword = "";
  newPassword = "";
  verificationCode = "";

  qrCode = "";
  loadingPassword = false;
  loadingRegenerate = false;
  loading = false;
  hasPassword = true;
  showQrCode = false;
  backupCodesAll = 0;
  backupCodesUsed = 0;
  twoFactorEnabled = false;

  backupCodesHtml(backupCodes: number[]) {
    return `In case you lose access to your authenticator device, you can use these backup codes to login. Make sure you keep them someplace safe. <strong>You won't see these backup codes again.</strong><div style="margin-top: 1rem; display: flex; flex-wrap: wrap; justify-content: center">${backupCodes
      .map((i: number) => `<div style="margin: 0.5rem"><code>${i}</code></div>`)
      .join("\n")}</div>`;
  }

  async created() {
    this.getPassword();
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data }: { data: any } = await this.$axios.get(
        `/users/${this.$route.params.id}?select=twoFactorEnabled,backupCodes`
      );
      this.twoFactorEnabled = data.twoFactorEnabled;
      this.backupCodesAll = (data.backupCodes || []).length;
      this.backupCodesUsed = (
        data.backupCodes.filter((i: any) => i.isUsed).length || []
      ).length;
    } catch (error) {}
    this.loading = false;
  }

  async getPassword() {
    this.loading = true;
    try {
      const { data }: { data: any } = await this.$axios.get(
        `/users/${this.$route.params.id}/security/password`
      );
      this.hasPassword = data.hasPassword;
    } catch (error) {}
  }

  async save() {
    this.loadingPassword = true;
    try {
      const { data } = await this.$axios.put(
        `/users/${this.$route.params.id}/security/password`,
        {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        }
      );
      this.$buefy.toast.open({
        message: data.text,
        type: "is-success",
      });
    } catch (error) {}
    this.oldPassword = "";
    this.newPassword = "";
    this.loadingPassword = false;
  }

  async enable() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/users/${this.$route.params.id}/security/2fa/enable`
      );
      this.qrCode = data.qrCode;
      this.showQrCode = true;
    } catch (error) {}
    this.loading = false;
  }
  async verify() {
    this.loading = true;
    try {
      const { data } = await this.$axios.post(
        `/users/${this.$route.params.id}/security/2fa/verify`,
        {
          code: this.verificationCode,
        }
      );
      this.showQrCode = false;
      this.twoFactorEnabled = true;
      this.$buefy.dialog.alert({
        title: "Backup codes",
        message: this.backupCodesHtml(data.backupCodes),
        confirmText: "Yes, I've copied them",
      });
    } catch (error) {}
    this.verificationCode = "";
    this.loading = false;
  }
  async regenerate() {
    this.$buefy.dialog.confirm({
      title: "Regenerate backup codes",
      message: `Are you sure you want to regenerate your backup codes? The current codes will stop working immediately.`,
      confirmText: "Yes, regenerate",
      cancelText: "No, don't regenerate",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loadingRegenerate = true;
        try {
          const { data } = await this.$axios.get(
            `/users/${this.$route.params.id}/security/backup-codes/regenerate`
          );
          this.$buefy.dialog.alert({
            title: "Backup codes",
            message: this.backupCodesHtml(data.backupCodes),
            confirmText: "Yes, I've copied them",
          });
        } catch (error) {}
        this.loadingRegenerate = false;
      },
    });
  }
  async disable(id: number, email: string) {
    this.$buefy.dialog.confirm({
      title: "Disabling 2FA",
      message: `Are you sure you want to disable two-factor authentication? This will make your account less secure.`,
      confirmText: "Yes, disable 2FA",
      cancelText: "No, don't disable 2FA",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          const { data } = await this.$axios.delete(
            `/users/${this.$route.params.id}/security/2fa`
          );
          this.twoFactorEnabled = false;
        } catch (error) {}
        this.loading = false;
      },
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
