<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <h2>Change password</h2>
      <form v-meta-ctrl-enter="changePassword" @submit.prevent="changePassword">
        <input hidden type="text" autocomplete="username" />
        <Input
          :value="oldPassword"
          type="password"
          autocomplete="current-password"
          label="Current password"
          placeholder="Enter your current password"
          required
          @input="val => (oldPassword = val)"
        />
        <Input
          :value="newPassword"
          type="password"
          autocomplete="new-password"
          label="New password"
          placeholder="Enter a secure password"
          required
          @input="val => (newPassword = val)"
        />
        <button class="button">
          Change password
        </button>
      </form>
      <h2>Two-factor authentication</h2>
      <p>
        Adding a second factor increases security while logging in to your
        account and doing sensitive operations. 2FA is currently
        <strong>{{
          user && user.twoFactorEnabled ? "enabled" : "disabled"
        }}</strong
        >.
      </p>
      <form
        v-if="user && !user.twoFactorEnabled"
        v-meta-ctrl-enter="enable2FA"
        @submit.prevent="enable2FA"
      >
        <button class="button button--type-loading" :disabled="enabling">
          <span>Enable 2FA</span>
          <font-awesome-icon
            v-if="enabling"
            class="icon icon--ml-2 icon--color-light"
            icon="sync"
            spin
          />
        </button>
      </form>
      <div v-else-if="user">
        <h3>Backup codes</h3>
        <p>
          If you're ever away from your authenticator device, you can use any of
          the following backup codes, once each. Keep them very safe.
        </p>
        <table class="table">
          <tbody>
            <tr>
              <td
                v-for="(code, index) in backupCodes.slice(0, 5)"
                :key="`bc_${index}_${code.id}`"
              >
                <code>{{ code.code }}</code>
                <span
                  v-if="!code.used"
                  aria-label="Available"
                  data-balloon-pos="up"
                >
                  <font-awesome-icon
                    class="icon icon--ml-2 icon--color-success"
                    icon="check-circle"
                  />
                </span>
                <span v-else aria-label="Used" data-balloon-pos="up">
                  <font-awesome-icon
                    title="Used"
                    class="icon icon--ml-2 icon--color-danger"
                    icon="exclamation-circle"
                  />
                </span>
              </td>
            </tr>
            <tr>
              <td
                v-for="(code, index) in backupCodes.slice(-5)"
                :key="`bc_${index}_${code.id}`"
              >
                <code>{{ code.code }}</code>
                <span
                  v-if="!code.used"
                  aria-label="Available"
                  data-balloon-pos="up"
                >
                  <font-awesome-icon
                    class="icon icon--ml-2 icon--color-success"
                    icon="check-circle"
                  />
                </span>
                <span v-else aria-label="Used" data-balloon-pos="up">
                  <font-awesome-icon
                    title="Used"
                    class="icon icon--ml-2 icon--color-danger"
                    icon="exclamation-circle"
                  />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <form
          class="section--mt-1"
          @submit.prevent="() => (showDisable = true)"
        >
          <button
            type="button"
            class="button"
            style="margin-right: 0.5rem"
            @click.prevent="regenerate"
          >
            Regenerate backup codes
          </button>
          <button class="button button--color-danger">
            Disable 2FA
          </button>
        </form>
      </div>
      <h2>Security events</h2>
      <p>
        These are the most recent security-related events from your account. You
        can
        <nuxt-link to="/settings/data">export your data</nuxt-link> for the
        entire list.
      </p>
      <table v-if="securityEvents" class="table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Browser</th>
            <th>OS</th>
            <th>Location</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(event, index) in securityEvents.data"
            :key="`${event.id}_${index}`"
          >
            <td>{{ textify(event.type) }}</td>
            <td>
              {{ parse(event.userAgent).browser.name }}
            </td>
            <td>
              {{ parse(event.userAgent).os.name }}
            </td>
            <td v-if="event.location">
              {{
                event.location.region_name ||
                  `${event.location.region_name}, ${event.location.country_code}`
              }}
            </td>
            <td>
              <TimeAgo :date="event.createdAt" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination text text--align-center">
        <button
          v-if="securityEvents && securityEvents.hasMore"
          class="button"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span>Load more events</span>
          <font-awesome-icon
            v-if="!loadingMore"
            class="icon"
            icon="arrow-down"
          />
          <font-awesome-icon
            v-else
            class="icon icon--ml-2 icon--color-light"
            icon="sync"
            spin
          />
        </button>
      </div>
      <p>
        If you don't recognize an event, you should immediately reset your
        password.
      </p>
    </div>
    <transition name="modal">
      <Modal v-if="showOTP" :on-close="() => (showOTP = false)">
        <h2>Enable two-factor authentication</h2>
        <p>To enable 2FA, scan this QR code in your Authenticator app.</p>
        <div class="text text--align-center">
          <img class="qr-code" alt="QR code" :src="qrCode" />
        </div>
        <form v-meta-ctrl-enter="verify2FA" @submit.prevent="verify2FA">
          <Input
            :value="verificationCode"
            type="number"
            autocomplete="one-time-code"
            label="One-time Password"
            placeholder="Enter the one-time password"
            required
            @input="val => (verificationCode = val)"
          />
          <button class="button button--color-primary">
            <span>Enable 2FA</span>
          </button>
        </form>
      </Modal>
    </transition>
    <transition name="modal">
      <Confirm v-if="showDisable" :on-close="() => (showDisable = false)">
        <h2>Are you sure you want to disable 2FA?</h2>
        <p>
          Disabling two-factor authentication means your account will be less
          secure.
        </p>
        <form v-meta-ctrl-enter="disable2FA" @submit.prevent="disable2FA">
          <Input
            :value="disableText"
            label='To confirm, enter "disable 2FA" below'
            placeholder="Write those exact words"
            required
            @input="val => (disableText = val)"
          />
          <button class="button button--color-danger button--state-cta">
            Yes, disable 2FA
          </button>
          <button type="button" class="button" @click="showDisable = false">
            No, don't disable
          </button>
        </form>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import UAParser from "ua-parser-js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faExclamationCircle,
  faCheckCircle,
  faSync,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Confirm from "@/components/Confirm.vue";
import Modal from "@/components/Modal.vue";
import {
  Email,
  SecurityEvent,
  BackupCode,
  SecurityEvents
} from "@/types/settings";
import { User } from "@/types/auth";
import en from "@/locales/en";
const text = en.securityEvents;
library.add(faExclamationCircle, faCheckCircle, faSync, faArrowDown);

@Component({
  components: {
    Loading,
    TimeAgo,
    Select,
    Input,
    Modal,
    Confirm,
    FontAwesomeIcon
  },
  computed: mapGetters({
    securityEvents: "settings/securityEvents",
    backupCodes: "settings/backupCodes",
    user: "auth/user"
  }),
  middleware: "auth"
})
export default class AccountSettings extends Vue {
  loading = "";
  oldPassword = "";
  newPassword = "";
  user!: User[];
  showOTP = false;
  enabling = false;
  loadingMore = false;
  showDisable = false;
  securityEvents!: SecurityEvents;
  backupCodes!: BackupCode[];
  disableText = "";
  verificationCode = "";
  qrCode = "";

  private mounted() {
    this.$store.dispatch("settings/getEvents");
    this.$store.dispatch("settings/getBackupCodes");
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch(
        "settings/getEvents",
        this.$store.state.settings.securityEvents.next
      )
      .then(() => {})
      .catch(() => {})
      .then(() => (this.loadingMore = false));
  }

  private textify(type: string) {
    if (text[type]) return text[type];
    return type;
  }

  private parse(userAgent: string) {
    const parser = new UAParser(userAgent);
    return parser.getResult();
  }

  private changePassword() {
    this.loading = "Updating your password";
    this.$store
      .dispatch("settings/updatePassword", {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      })
      .then(() => this.$store.dispatch("auth/refresh"))
      .catch(() => {})
      .then(() => {
        this.loading = "";
      });
    this.oldPassword = "";
    this.newPassword = "";
  }

  private enable2FA() {
    this.enabling = true;
    this.$store
      .dispatch("settings/getEnable2FA")
      .then(response => {
        this.qrCode = response.qrCode;
        this.showOTP = true;
      })
      .catch(() => {})
      .then(() => {
        this.enabling = false;
      });
  }

  private verify2FA() {
    this.loading = "Enabling 2FA";
    this.showOTP = false;
    this.$store
      .dispatch("settings/postVerify2FA", this.verificationCode)
      .then(() => this.$store.dispatch("auth/refresh"))
      .catch(() => {})
      .then(() => {
        this.verificationCode = "";
        this.loading = "";
      });
  }

  private regenerate() {
    this.loading = "Regenerating backup codes";
    this.$store
      .dispatch("settings/regenerateCodes")
      .then(() => {})
      .catch(() => {})
      .then(() => {
        this.loading = "";
      });
  }

  private disable2FA() {
    if (this.disableText !== "disable 2FA") return;
    this.loading = "Disabling 2FA";
    this.showDisable = false;
    this.$store
      .dispatch("settings/disable2FA", this.verificationCode)
      .then(() => this.$store.dispatch("auth/refresh"))
      .catch(() => {})
      .then(() => {
        this.verificationCode = "";
        this.loading = "";
      });
  }
}
</script>

<style lang="scss" scoped>
.qr-code {
  background-color: gray;
  width: 200px;
  height: 200px;
  display: inline-block;
  margin-bottom: 2rem;
}
</style>
