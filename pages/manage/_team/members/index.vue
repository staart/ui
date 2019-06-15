<template>
  <main>
    <h1>Team</h1>
    <Loading v-if="loading" :message="loading" />
    <table v-else-if="memberships && memberships.data" class="table">
      <thead>
        <th>Name</th>
        <th>Joined</th>
        <th>Role</th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="(member, index) in memberships.data"
          :key="`${member.id}_${index}`"
        >
          <td><User :user="member.user" /></td>
          <td><TimeAgo :date="member.createdAt" /></td>
          <td>{{ membershipRoles[member.role] || member.role }}</td>
          <td class="text text--align-right">
            <router-link
              :to="`/manage/${$route.params.team}/members/${member.id}`"
              data-balloon="Edit"
              data-balloon-pos="up"
              class="button button--type-icon"
            >
              <font-awesome-icon
                title="Edit"
                class="icon"
                icon="pencil-alt"
                fixed-width
              />
            </router-link>
            <button
              data-balloon="Remove"
              data-balloon-pos="up"
              class="button button--color-danger button--type-icon"
              @click="showDelete = member"
            >
              <font-awesome-icon
                title="Remove"
                class="icon icon--color-danger"
                icon="trash"
                fixed-width
              />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination text text--align-center">
      <button
        v-if="memberships && memberships.hasMore"
        class="button"
        :disabled="loadingMore"
        @click="loadMoreMembers"
      >
        <span>Load more members</span>
        <font-awesome-icon v-if="!loadingMore" class="icon" icon="arrow-down" />
        <font-awesome-icon
          v-else
          title="Available"
          class="icon icon--ml-2 icon--color-light"
          icon="sync"
          spin
        />
      </button>
    </div>
    <h2>Invite another member</h2>
    <p>
      Use this form to invite another user from your team to this organization.
    </p>
    <Loading v-if="inviting" />
    <form v-else @submit.prevent="inviteMember">
      <Input
        :value="newUserName"
        label="Name"
        placeholder="Enter new user's full name"
        required
        @input="val => (newUserName = val)"
      />
      <Input
        :value="newUserEmail"
        type="email"
        label="Email"
        placeholder="Enter new user's email"
        required
        @input="val => (newUserEmail = val)"
      />
      <Select
        :value="newUserRole"
        label="Role"
        :options="membershipRoles"
        required
        @input="val => (newUserRole = val)"
      />
      <button class="button">Send invitation</button>
    </form>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to remove {{ showDelete.user.name }}?</h2>
        <p>
          Removing someone from your organization is not reversible, and you'll
          need to invite them again if you change your mind.
        </p>
        <p>
          If they have any organization-specific data, that will also be
          deleted.
        </p>
        <button
          class="button button--color-danger-cta"
          @click="deleteMembership(showDelete.id)"
        >
          Yes, remove {{ showDelete.user.nickname }}
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't remove
        </button>
      </Confirm>
    </transition>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import User from "@/components/User.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Confirm from "@/components/Confirm.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { Email } from "@/types/settings";
import locale from "@/locales/en";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faPencilAlt,
  faArrowDown,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import { Members, emptyPagination } from "@/types/manage";
library.add(faTrash, faPencilAlt, faArrowDown, faSync);

@Component({
  components: {
    TimeAgo,
    User,
    Loading,
    Input,
    Select,
    Checkbox,
    FontAwesomeIcon,
    Confirm
  },
  middleware: "auth"
})
export default class ManageMembers extends Vue {
  memberships: Members = emptyPagination;
  loading = "";
  inviting = false;
  showDelete = null;
  loadingMore = false;
  membershipRoles = locale.membershipRoles;

  newUserName = "";
  newUserEmail = "";
  newUserRole = 3;

  private created() {
    this.memberships = {
      ...this.$store.getters["manage/memberships"](this.$route.params.team)
    };
  }

  private mounted() {
    this.loading = "Loading members";
    this.$store
      .dispatch("manage/getMembers", { team: this.$route.params.team })
      .then(memberships => (this.memberships = { ...memberships }))
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
  private loadMoreMembers() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getMembers", {
        team: this.$route.params.team,
        start: this.$store.state.manage.memberships[this.$route.params.team]
          .next
      })
      .then(memberships => {
        this.memberships = {
          ...this.$store.getters["manage/memberships"](this.$route.params.team)
        };
      })
      .catch(() => {})
      .finally(() => (this.loadingMore = false));
  }

  private inviteMember() {
    this.inviting = true;
    this.$store
      .dispatch("manage/inviteMember", {
        name: this.newUserName,
        email: this.newUserEmail,
        role: this.newUserRole,
        team: this.$route.params.team
      })
      .then(memberships => (this.memberships = { ...memberships }))
      .catch(() => {})
      .finally(() => (this.inviting = false));
    this.newUserName = "";
    this.newUserEmail = "";
  }

  private deleteMembership(id: number) {
    this.showDelete = null;
    this.loading = "Deleting membership";
    this.$store
      .dispatch("manage/deleteMembership", {
        id,
        team: this.$route.params.team
      })
      .then(memberships => (this.memberships = { ...memberships }))
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>
