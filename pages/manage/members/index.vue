<template>
  <main>
    <Manage>
      <h1>Team</h1>
      <Loading v-if="loading" :message="loading" />
      <table v-else class="table">
        <thead>
          <th>Name</th>
          <th>Joined</th>
          <th>Role</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="(member, index) in members" :key="`${member.id}_${index}`">
            <td>
              <img
                class="user-image"
                alt=""
                :src="member.user.profilePicture"
              />
              {{ member.user.name }}
            </td>
            <td><TimeAgo :date="member.createdAt" /></td>
            <td>{{ membershipRoles[member.role] || member.role }}</td>
            <td class="text text--align-right">
              <button
                data-balloon="Remove"
                data-balloon-pos="up"
                class="button button--color-danger button--type-icon"
                @click="deleteMembership(member.id)"
              >
                <font-awesome-icon
                  title="Remove"
                  class="icon icon--color-danger"
                  icon="trash"
                  fixed-width
                />
              </button>
              <router-link
                :to="`/manage/members/${member.id}`"
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
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Invite another member</h2>
      <p>
        Use this form to invite another user from your team to this
        organization.
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
    </Manage>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Manage from "@/components/Manage.vue";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import locale from "@/locales/en";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { User } from "@/types/auth";
import { Email } from "@/types/settings";
library.add(faTrash, faPencilAlt);

@Component({
  components: {
    Manage,
    TimeAgo,
    Loading,
    Input,
    Select,
    Checkbox,
    FontAwesomeIcon
  },
  computed: mapGetters({
    members: "manage/members"
  })
})
export default class ManageMembers extends Vue {
  members!: any;
  loading = "";
  inviting = false;
  membershipRoles = locale.membershipRoles;

  newUserName = "";
  newUserEmail = "";
  newUserRole = 3;

  private mounted() {
    this.loading = "Loading members";
    this.$store
      .dispatch("manage/getMembers")
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private inviteMember() {
    this.inviting = true;
    this.$store
      .dispatch("manage/inviteMember", {
        name: this.newUserName,
        email: this.newUserEmail,
        role: this.newUserRole
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.inviting = false));
  }

  private deleteMembership(id: number) {
    this.loading = "Deleting membership";
    this.$store
      .dispatch("manage/deleteMembership", id)
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped>
.user-image {
  height: 2rem;
  border-radius: 100%;
  width: 2rem;
  vertical-align: middle;
  margin-right: 0.5rem;
}
</style>
