<template>
  <main>
    <div class="row">
      <h2>Domains</h2>
      <div class="text text--align-right">
        <button
          aria-label="Refresh"
          data-balloon-pos="down"
          class="button button--type-icon"
          @click="load"
        >
          <font-awesome-icon
            title="Refresh"
            class="icon"
            icon="sync"
            :spin="!!loading"
            fixed-width
          />
        </button>
      </div>
    </div>
    <table v-if="domains && domains.data && domains.data.length" class="table">
      <thead>
        <th>Domain</th>
        <th></th>
      </thead>
      <tbody>
        <tr
          v-for="(domain, index) in domains.data"
          :key="`${domain.id}_${index}`"
        >
          <td>
            <span>{{ domain.domain }}</span>
            <span
              v-if="domain.isVerified"
              aria-label="Verified"
              data-balloon-pos="up"
            >
              <font-awesome-icon
                title="Verified"
                class="icon icon--ml-2 icon--color-success"
                icon="check-circle"
              />
            </span>
            <span v-else aria-label="Unverified" data-balloon-pos="up">
              <font-awesome-icon
                title="Unverified"
                class="icon icon--ml-2 icon--color-danger"
                icon="exclamation-circle"
              />
            </span>
          </td>
          <td class="text text--align-right">
            <router-link
              v-if="!domain.isVerified"
              :to="`/manage/${$route.params.team}/domains/${domain.id}`"
              data-balloon-pos="up"
              class="button button--type-icon"
            >
              <font-awesome-icon
                class="icon icon--mr-1"
                icon="lock"
                fixed-width
              />
              <span>Verify</span>
            </router-link>
            <button
              aria-label="Remove"
              data-balloon-pos="up"
              class="button button--color-danger button--type-icon"
              @click="showDelete = domain"
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
    <Loading v-else-if="loading" :message="loading" />
    <div class="pagination text text--align-center">
      <button
        v-if="domains && domains.hasMore"
        class="button"
        :disabled="loadingMore"
        @click="loadMoreDomains"
      >
        <span>Load more domains</span>
        <font-awesome-icon v-if="!loadingMore" class="icon" icon="arrow-down" />
        <font-awesome-icon
          v-else
          class="icon icon--ml-2 icon--color-light"
          icon="sync"
          spin
        />
      </button>
    </div>
    <h2>Add domain</h2>
    <p>
      Use this form to add a domain your team owns.
    </p>
    <Loading v-if="creating" message="Adding domain" />
    <form
      v-else
      v-meta-ctrl-enter="createDomain"
      @submit.prevent="createDomain"
    >
      <Input
        :value="newDomain"
        label="Domain"
        placeholder="Enter the hostname, e.g., oswaldlabs.com"
        required
        @input="val => (newDomain = val)"
      />
      <button class="button">Add domain</button>
    </form>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to delete {{ showDelete.domain }}?</h2>
        <p>
          Removing a domain is not reversible, and you'll have to verify your
          domain again if you change your mind.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteDomain(showDelete.id)"
        >
          Yes, delete {{ showDelete.domain }}
        </button>
        <button type="button" class="button" @click="showDelete = null">
          No, don't delete
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
  faTrash,
  faPencilAlt,
  faArrowDown,
  faSync,
  faExclamationCircle,
  faCheckCircle,
  faLock
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Confirm from "@/components/Confirm.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { Email } from "@/types/settings";
import locale from "@/locales/en";
import { Domains, emptyPagination } from "@/types/manage";
library.add(
  faTrash,
  faPencilAlt,
  faArrowDown,
  faSync,
  faExclamationCircle,
  faCheckCircle,
  faLock
);

@Component({
  components: {
    TimeAgo,
    Loading,
    Input,
    Select,
    Checkbox,
    FontAwesomeIcon,
    Confirm
  },
  computed: mapGetters({
    user: "auth/user"
  }),
  middleware: "auth"
})
export default class ManageDomains extends Vue {
  domains: Domains = emptyPagination;
  loading = "";
  creating = false;
  showDelete = null;
  loadingMore = false;

  newDomain = "";

  private created() {
    this.domains = {
      ...this.$store.getters["manage/domains"](this.$route.params.team)
    };
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading domains";
    this.$store
      .dispatch("manage/getDomains", { team: this.$route.params.team })
      .then(domains => (this.domains = { ...domains }))
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private loadMoreDomains() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getDomains", {
        team: this.$route.params.team,
        start: this.$store.state.manage.domains[this.$route.params.team].next
      })
      .then(domains => {
        this.domains = {
          ...this.$store.getters["manage/domains"](this.$route.params.team)
        };
      })
      .catch(() => {})
      .finally(() => (this.loadingMore = false));
  }

  private createDomain() {
    this.creating = true;
    this.$store
      .dispatch("manage/createDomain", {
        domain: this.newDomain,
        team: this.$route.params.team
      })
      .then(domains => (this.domains = { ...domains }))
      .catch(() => {})
      .finally(() => (this.creating = false));
    this.newDomain = "";
  }

  private deleteDomain(id: number) {
    this.showDelete = null;
    this.loading = "Deleting domain";
    this.$store
      .dispatch("manage/deleteDomain", {
        id,
        team: this.$route.params.team
      })
      .then(domains => (this.domains = { ...domains }))
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }
}
</script>
