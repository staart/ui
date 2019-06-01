<template>
  <main>
    <h2>Memberships</h2>
    <p>
      You can switch which team you are using Staart as here.
    </p>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div v-if="!memberships.length" class="card card--type-padded">
        <LargeMessage
          heading="No teams"
          text="You're not a member of any teams yet, let's change that."
        />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Team</th>
            <th>Joined</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(membership, index) in memberships"
            :key="`${membership.id}_${index}`"
          >
            <td>{{ membership.organization.name }}</td>
            <td><TimeAgo :date="membership.createdAt" /></td>
            <td>{{ membershipRoles[membership.role] || membership.role }}</td>
            <td class="text text--align-right">
              <button
                data-balloon="Dashboard"
                data-balloon-pos="up"
                class="button button--type-icon"
                @click="
                  visitOrganization(membership.organizationId, '/dashboard')
                "
              >
                <font-awesome-icon title="Dashboard" icon="eye" fixed-width />
              </button>
              <button
                data-balloon="Settings"
                data-balloon-pos="up"
                class="button button--type-icon"
                @click="
                  visitOrganization(
                    membership.organizationId,
                    '/manage/settings'
                  )
                "
              >
                <font-awesome-icon title="Settings" icon="cog" fixed-width />
              </button>
              <button
                data-balloon="Leave organization"
                data-balloon-pos="up"
                class="button button--color-danger button--type-icon"
                @click="showDelete = membership"
              >
                <font-awesome-icon
                  title="Leave organization"
                  class="icon icon--color-danger"
                  icon="trash"
                  fixed-width
                />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Create a team</h2>
    <p>
      To invite your team to Staart, get started by creating a new team.
    </p>
    <Loading v-if="isCreating" message="Creating your team" />
    <form v-else @submit.prevent="createOrganization">
      <Input
        :value="organizationName"
        label="Name"
        placeholder="Enter your team's name"
        required
        @input="val => (organizationName = val)"
      />
      <button class="button">
        Create team
      </button>
    </form>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>
          Are you sure you want to leave {{ showDelete.organization.name }}?
        </h2>
        <p>
          Leaving a team is not reversible, and you'll have to ask an admin to
          add you again if you change your mind.
        </p>
        <button
          class="button button--color-danger-cta"
          @click="deleteMembership(showDelete.id)"
        >
          Yes, leave {{ showDelete.organization.name }}
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't leave
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import en from "@/locales/en";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faEye, faCog } from "@fortawesome/free-solid-svg-icons";
import { Email } from "@/types/settings";
library.add(faTrash, faEye, faCog);

@Component({
  components: {
    LargeMessage,
    Loading,
    Input,
    TimeAgo,
    FontAwesomeIcon,
    Confirm
  },
  computed: mapGetters({
    memberships: "settings/memberships"
  }),
  middleware: "auth"
})
export default class AccountSettings extends Vue {
  loading = "";
  organizationName = "";
  isCreating = false;
  membershipRoles = en.membershipRoles;
  showDelete = null;

  private mounted() {
    this.loading = "Loading your organizations";
    this.$store
      .dispatch("settings/getMemberships")
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private deleteMembership(id: number) {
    this.showDelete = null;
    this.loading = "Leaving organization";
    this.$store
      .dispatch("settings/deleteMembership", id)
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private createOrganization() {
    this.isCreating = true;
    this.$store
      .dispatch("settings/createOrganization", {
        name: this.organizationName
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.isCreating = false));
    this.organizationName = "";
  }

  private visitOrganization(organizationId: number, thenTo: string) {
    this.$store
      .dispatch("auth/setOrganization", organizationId)
      .then(() => {
        this.$router.push(thenTo);
      })
      .catch(() => {});
  }
}
</script>

<style lang="scss" scoped></style>
