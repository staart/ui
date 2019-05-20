<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <h2>Change password</h2>
      <form @submit.prevent="changePassword">
        <input hidden type="text" autocomplete="username" />
        <Input
          :value="currentPassword"
          type="password"
          autocomplete="current-password"
          label="Current password"
          placeholder="Enter your current password"
          required
          @input="val => (currentPassword = val)"
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
        <strong>{{ user.twoFactorEnabled ? "enabled" : "disabled" }}</strong
        >.
      </p>
      <form @submit.prevent="saveNotifications">
        <button class="button">
          Enable 2FA
        </button>
      </form>
      <h2>Security events</h2>
      <p>
        These are the most recent security-related events from your account. You
        can
        <nuxt-link to="/settings/data">export your data</nuxt-link> for the
        entire list.
      </p>
      <table class="table">
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
            v-for="(event, index) in securityEvents"
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
              {{ event.location.region_code }},
              {{ event.location.country_code }}
            </td>
            <td>
              <TimeAgo :date="event.createdAt" />
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        If you don't recognize an event, you should immediately reset your
        password.
      </p>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import UAParser from "ua-parser-js";
import { Email, SecurityEvent } from "@/types/settings";
import { User } from "@/types/auth";
import en from "@/locales/en";
const text = en.securityEvents;

@Component({
  components: {
    Loading,
    TimeAgo,
    Select,
    Input
  },
  computed: mapGetters({
    securityEvents: "settings/securityEvents",
    user: "auth/user"
  })
})
export default class AccountSettings extends Vue {
  loading = "";
  currentPassword = "";
  newPassword = "";
  user!: User[];
  securityEvents!: SecurityEvent[];

  private mounted() {
    this.$store.dispatch("settings/getEvents");
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
      .dispatch("settings/updateUser", { password: this.newPassword })
      .then(() => (this.loading = ""));
    this.currentPassword = "";
    this.newPassword = "";
  }
}
</script>

<style lang="scss" scoped></style>
