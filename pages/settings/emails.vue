<template>
  <main>
    <Settings>
      <h1>Emails</h1>
      <p>
        You can login to your account with any of the following verified emails.
      </p>
      <Loading v-if="loading" :message="loading" />
      <div v-else>
        <table class="table">
          <tbody>
            <tr v-for="(email, index) in emails" :key="`${email.id}${index}`">
              <td>
                {{ email.email }}<span v-if="email.isPrimary"> (Primary)</span
                ><span v-if="email.isVerified"> ✅</span>
              </td>
              <td class="text text--align-right">
                <button
                  v-if="!email.isPrimary"
                  class="button"
                  @click="deleteEmail(email.id)"
                >
                  Delete
                </button>
                <button
                  v-if="!email.isPrimary && email.isVerified"
                  class="button"
                  @click="makePrimary(email.id)"
                >
                  Make primary
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Add another email</h2>
        <form @submit.prevent="addEmail">
          <Input
            :value="newEmail"
            type="email"
            label="Email"
            placeholder="Enter another one of your emails"
            required
            @input="val => (newEmail = val)"
          />
          <button class="button button--color-primary">
            Add another email
          </button>
        </form>
      </div>
    </Settings>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Settings from "@/components/Settings.vue";
import Loading from "@/components/Loading.vue";
import Input from "@/components/form/Input.vue";
import { Email } from "../../types/settings";

@Component({
  components: {
    Settings,
    Loading,
    Input
  },
  computed: mapGetters({
    emails: "settings/emails"
  })
})
export default class AccountSettings extends Vue {
  loading = "";
  newEmail = "";

  private mounted() {
    this.loading = "Loading emails";
    this.$store.dispatch("settings/getEmails").then(() => {
      this.loading = "";
    });
  }

  private addEmail() {
    this.loading = "Adding email";
    this.$store
      .dispatch("settings/addEmail", { email: this.newEmail })
      .then(() => {})
      .catch(() => {})
      .then(() => (this.loading = ""));
    this.newEmail = "";
  }

  private deleteEmail(id: number) {
    this.loading = "Deleting email";
    this.$store
      .dispatch("settings/deleteEmail", id)
      .then(() => (this.loading = ""));
  }

  private makePrimary(id: number) {
    this.loading = "Setting primary email";
    this.$store
      .dispatch("settings/updateUser", { primaryEmail: id })
      .then(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
