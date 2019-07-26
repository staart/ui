<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <h2>Change password</h2>
      <form @submit.prevent="changePassword">
        <Input
          label="Current password"
          type="password"
          placeholder="Enter your current password"
          :value="oldPassword"
          @input="val => (oldPassword = val)"
        />
        <Input
          label="New password"
          type="password"
          placeholder="Enter a new password"
          :value="newPassword"
          @input="val => (newPassword = val)"
        />
        <button class="button">Change password</button>
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
            class="icon icon--ml-2"
            icon="sync"
            spin
          />
        </button>
      </form>
      <form
        v-else
        v-meta-ctrl-enter="() => (showDisable = true)"
        @submit.prevent="() => (showDisable = true)"
      >
        <button
          class="button button--type-loading button--color-danger"
          :disabled="enabling"
        >
          <span>Disable 2FA</span>
          <font-awesome-icon
            v-if="enabling"
            class="icon icon--ml-2"
            icon="sync"
            spin
          />
        </button>
      </form>
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
      <Modal
        v-if="showBackupCodes"
        :on-close="() => (showBackupCodes = false)"
        :disable-background-close="true"
        close-text="I've copied these backup codes somewhere safe"
      >
        <h2>Backup codes</h2>
        <p>
          You can use these backup codes in case you don't have access to your
          authenticator device or app. You can only use each code ones. Make
          sure you keep them safe.
        </p>
        <ul v-if="backupCodes" class="codes">
          <li v-for="(code, i) in backupCodes" :key="`k${code.code}${i}`">
            <code>{{ code.code }}</code>
          </li>
        </ul>
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
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSync,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal.vue";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User, Emails, emptyPagination, Email, emptyUser } from "@/types/users";

library.add(
  faArrowDown,
  faSync,
  faTrash,
  faCheckCircle,
  faExclamationCircle,
  faStar,
  faEnvelopeOpen
);

@Component({
  components: {
    Loading,
    Confirm,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Modal,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  user: User = emptyUser;
  loading = "";
  oldPassword = "";
  newPassword = "";
  disableText = "";
  verificationCode = "";
  qrCode = "";
  showOTP = false;
  enabling = false;
  showDisable = false;
  showBackupCodes = false;
  backupCodes: any = [];

  private created() {
    this.user = {
      ...this.$store.getters["users/user"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading security details";
    this.$store
      .dispatch("users/getUser", this.$route.params.slug)
      .then(user => {
        this.user = { ...user };
        if (this.user.twoFactorEnabled) {
          return this.$store.dispatch(
            "users/getBackupCodes",
            this.$route.params.slug
          );
        }
      })
      .then(backupCodes => {
        if (backupCodes) {
          this.backupCodes = { ...backupCodes };
        }
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private changePassword() {
    this.loading = "Updating your password";
    this.$store
      .dispatch("users/updatePassword", {
        slug: this.$route.params.slug,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      })
      .then(user => {
        this.user = { ...user };
      })
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
      .dispatch("users/enable2FA", { slug: this.$route.params.slug })
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
      .dispatch("users/verify2FA", {
        slug: this.$route.params.slug,
        code: this.verificationCode
      })
      .then(backupCodes => {
        this.backupCodes = { ...backupCodes };
        this.showBackupCodes = true;
        this.user.twoFactorEnabled = true;
      })
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
      .dispatch("users/regenerateCodes", { slug: this.$route.params.slug })
      .then(backupCodes => {
        this.backupCodes = { ...backupCodes };
      })
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
      .dispatch("users/disable2FA", { slug: this.$route.params.slug })
      .then(user => {
        this.user = { ...user };
      })
      .then(() => this.$store.dispatch("auth/refresh"))
      .catch(() => {})
      .then(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped>
.codes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 0 2rem 0;
  padding: 0;
  li {
    width: 20%;
    margin: 0 0 1rem 0;
    padding: 0;
    list-style: none;
  }
}
</style>
