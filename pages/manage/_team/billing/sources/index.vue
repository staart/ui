<template>
  <main>
    <largeMessage
      v-if="noBilling"
      heading="No billing account"
      text="You need to setup a billing account before you view your sources."
      cta-text="Setup billing"
      :cta-to="`/manage/${$route.params.team}/billing/details`"
    />
    <Loading v-else-if="loading" :message="loading" />
    <div v-else>
      <div class="row">
        <h1>Payment methods</h1>
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
              fixed-width
            />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="!loading && (!sources || !sources.data || !sources.data.length)"
        heading="No payment methods yet"
        text="Add your credit card to for automatic payments."
      />
      <div v-else-if="sources && sources.data && sources.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Source #</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(source, index) in sources.data"
              :key="`${source.id}_${index}`"
            >
              <td>
                <code>{{ source.id }}</code>
              </td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/manage/${$route.params.team}/billing/sources/${source.id}`
                  "
                  aria-label="Details"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    title="Details"
                    class="icon"
                    icon="pencil-alt"
                    fixed-width
                  />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination text text--align-center">
          <button
            v-if="sources && sources.hasMore"
            class="button"
            :disabled="loadingMore"
            @click="loadMore"
          >
            <span>Load more sources</span>
            <font-awesome-icon
              v-if="!loadingMore"
              class="icon"
              icon="arrow-down"
            />
            <font-awesome-icon
              v-else
              title="Available"
              class="icon icon--ml-2 icon--color-light"
              icon="sync"
              spin
            />
          </button>
        </div>
      </div>
      <h2>Add card</h2>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPencilAlt,
  faArrowDown,
  faSync,
  faCloudDownloadAlt
} from "@fortawesome/free-solid-svg-icons";
import { Sources, emptyPagination } from "@/types/manage";
library.add(faPencilAlt, faCloudDownloadAlt, faArrowDown, faSync);

@Component({
  components: {
    Loading,
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
  sources: Sources = emptyPagination;
  loadingMore = false;
  noBilling = false;
  loading = "";
  cardNumber = "";

  private created() {
    this.sources = {
      ...this.$store.getters["manage/sources"](this.$route.params.team)
    };
  }

  private load() {
    this.loading = "Loading your sources";
    this.$store
      .dispatch("manage/getSources", { team: this.$route.params.team })
      .then(sources => {
        this.sources = { ...sources };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loading = ""));
  }

  private mounted() {
    this.load();
  }

  private loadMore() {
    this.loadingMore = true;
    this.$store
      .dispatch("manage/getSources", {
        team: this.$route.params.team,
        start: this.$store.state.manage.sources[this.$route.params.team].next
      })
      .then(() => {
        this.sources = {
          ...this.$store.getters["manage/sources"](this.$route.params.team)
        };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => (this.loadingMore = false));
  }
}
</script>

<style lang="scss" scoped></style>
