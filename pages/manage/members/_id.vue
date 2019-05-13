<template>
  <main>
    <Manage>
      <h1>Membership</h1>
      <div v-if="membership">
        <table class="table table--type-cols">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{{ membership.user.name }}</td>
            </tr>
            <tr>
              <td>Joined organization</td>
              <td><TimeAgo :date="membership.createdAt" /></td>
            </tr>
            <tr>
              <td>Country</td>
              <td>{{ membership.user.countryCode }}</td>
            </tr>
            <tr>
              <td>Timezone</td>
              <td>{{ membership.user.timezone }}</td>
            </tr>
          </tbody>
        </table>
        <h2>Edit memberhsip</h2>
      </div>
      <Loading v-if="inviting" />
      <form v-else @submit.prevent="inviteMember">
        <Select
          :value="newUserRole"
          label="Role"
          :options="membershipRoles"
          required
          @input="val => (newUserRole = val)"
        />
        <button class="button">Update membership</button>
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
import { Membership } from "@/types/manage";
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
  membership: Membership | null = null;
  inviting = "";
  membershipRoles = locale.membershipRoles;
  newUserRole = 3;

  private mounted() {
    this.inviting = "Loading member details";
    this.$store
      .dispatch("manage/getMembership", this.$route.params.id)
      .then(membership => {
        this.membership = membership;
        this.newUserRole = membership.role;
      })
      .catch(() => {})
      .finally(() => (this.inviting = ""));
  }

  private inviteMember() {
    this.inviting = "Updating member details";
    this.$store
      .dispatch("manage/updateMembership", {
        id: this.$route.params.id,
        role: this.newUserRole
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.inviting = ""));
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
