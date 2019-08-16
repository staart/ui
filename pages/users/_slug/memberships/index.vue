<template>
  <main>
    <Loading v-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Memberships</h1>
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
      <LargeMessage
        v-if="
          !loading &&
            (!memberships || !memberships.data || !memberships.data.length)
        "
        heading="No memberships yet"
        img="undraw_software_engineer_lvl5.svg"
        text="Create a team below"
      />
      <div
        v-else-if="memberships && memberships.data && memberships.data.length"
      >
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(membership, index) in memberships.data"
              :key="`${membership.id}_${index}`"
            >
              <td>{{ membership.organization.name }}</td>
              <td>{{ membershipRoles[membership.role] || membership.role }}</td>
              <td><TimeAgo :date="membership.createdAt" /></td>
              <td class="text text--align-right">
                <router-link
                  :to="`/dashboard/${membership.organization.username}`"
                  aria-label="View dashboard"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon class="icon" icon="eye" fixed-width />
                </router-link>
                <router-link
                  :to="`/manage/${membership.organization.username}/settings`"
                  aria-label="Team settings"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon class="icon" icon="cog" fixed-width />
                </router-link>
                <button
                  aria-label="Leave team"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = membership)"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="sign-out-alt"
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
            @click="loadMore"
          >
            <span>Load more memberships</span>
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
      </div>
      <h2>Create another team</h2>
      <p>
        To invite your team to Staart, get started by creating a new team.
      </p>
      <form @submit.prevent="createNewTeam">
        <Input
          label="Name"
          placeholder="Enter your team's name"
          :value="newName"
          required
          @input="val => (newName = val)"
        />
        <button class="button">Set up your team</button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to leave this team?</h2>
        <p>
          Leaving a team is not reversible, and you'll need to ask someone from
          your team to add you again if you change your mind.
        </p>
        <button
          class="button button--color-danger button--state-cta"
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
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faSync,
  faSignOutAlt,
  faEye,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import Confirm from "@/components/Confirm.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Memberships, emptyPagination, Membership } from "@/types/users";
import translations from "@/locales/en";
const scopes = translations.userScopes;
library.add(faArrowDown, faSync, faSignOutAlt, faEye, faCog);

@Component({
  components: {
    Loading,
    Confirm,
    TimeAgo,
    Input,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  memberships: Memberships = emptyPagination;
  showDelete: Membership | null = null;
  membershipRoles = translations.membershipRoles;
  loadingMore = false;
  loading = "";
  newName = "";
  scopes = scopes;

  private created() {
    this.memberships = {
      ...this.$store.getters["users/memberships"](this.$route.params.slug)
    };
  }

  private load() {
    this.loading = "Loading your memberships";
    this.$store
      .dispatch("users/getMemberships", { slug: this.$route.params.slug })
      .then(memberships => {
        this.memberships = { ...memberships };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("users/getMemberships", {
        slug: this.$route.params.slug,
        start: this.$store.state.users.memberships[this.$route.params.slug].next
      })
      .then(() => {
        this.memberships = {
          ...this.$store.getters["users/memberships"](this.$route.params.slug)
        };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loadingMore = false));
  }

  private createNewTeam() {
    this.loading = "Creating your team";
    this.$store
      .dispatch("users/createOrganization", {
        name: this.newName,
        slug: this.$route.params.slug
      })
      .then(memberships => {
        this.memberships = { ...memberships };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.newName = "";
      });
  }

  private deleteMembership(key: number) {
    this.showDelete = null;
    this.loading = "Leaving team";
    this.$store
      .dispatch("users/deleteMembership", {
        slug: this.$route.params.slug,
        id: key
      })
      .then(memberships => {
        this.memberships = { ...memberships };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => (this.loading = ""));
  }
}
</script>

<style lang="scss" scoped></style>
