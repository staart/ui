<template>
  <main>
    <div class="row">
      <div>
        <nuxt-link
          :to="`/manage/${$route.params.team}/members`"
          aria-label="Back"
          data-balloon-pos="down"
          class="button button--type-icon button--type-back"
        >
          <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
        </nuxt-link>
        <h1>Membership</h1>
      </div>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon class="icon" icon="sync" fixed-width />
        </button>
      </div>
    </div>
    <div v-if="membership">
      <table class="table table--type-cols">
        <tbody>
          <tr>
            <td>Name</td>
            <td><User :user="membership.user" /></td>
          </tr>
          <tr>
            <td>Joined organization</td>
            <td><TimeAgo :date="membership.createdAt" /></td>
          </tr>
          <tr>
            <td>Country</td>
            <td><Country :code="membership.user.countryCode" /></td>
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
    <form
      v-else
      v-meta-ctrl-enter="updateMembership"
      @submit.prevent="updateMembership"
    >
      <Select
        :value="newUserRole"
        label="Role"
        :options="membershipRoles"
        required
        @input="val => (newUserRole = val)"
      />
      <button class="button">Update membership</button>
    </form>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faPencilAlt,
  faSync,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Country from "@/components/Country.vue";
import User from "@/components/User.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import locale from "@/locales/en";
import { Membership } from "@/types/manage";
library.add(faTrash, faPencilAlt, faSync, faArrowLeft);

@Component({
  components: {
    Country,
    TimeAgo,
    Loading,
    Input,
    User,
    Select,
    Checkbox,
    FontAwesomeIcon
  },
  computed: mapGetters({
    members: "manage/members"
  }),
  middleware: "auth"
})
export default class ManageMembers extends Vue {
  members!: any;
  membership: Membership | null = null;
  inviting = "";
  membershipRoles = locale.membershipRoles;
  newUserRole = 3;

  private load() {
    this.inviting = "Loading member details";
    this.$store
      .dispatch("manage/getMembership", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(membership => {
        this.membership = membership;
        this.newUserRole = membership.role;
      })
      .catch(() => {})
      .finally(() => (this.inviting = ""));
  }

  private mounted() {
    this.load();
  }

  private updateMembership() {
    this.inviting = "Updating member details";
    this.$store
      .dispatch("manage/updateMembership", {
        team: this.$route.params.team,
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
