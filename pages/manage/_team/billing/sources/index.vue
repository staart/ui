<template>
  <main>
    <largeMessage
      v-if="noBilling"
      heading="No billing account"
      text="You need to setup a billing account before you view your sources. You only need a billing account if you want to switch to a paid subscription, you can continue to use your free account."
      cta-text="Setup billing"
      :cta-to="`/manage/${$route.params.team}/billing/details`"
    />
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
              :spin="!!loading"
              fixed-width
            />
          </button>
        </div>
      </div>
      <LargeMessage
        v-if="!loading && (!sources || !sources.data || !sources.data.length)"
        heading="No payment methods yet"
        img="undraw_credit_card_payment_yb88.svg"
        text="Add your credit card below for automatic payments."
      />
      <div v-else-if="sources && sources.data && sources.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Card number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(source, index) in sources.data"
              :key="`${source.id}_${index}`"
            >
              <td>{{ source.name }}</td>
              <td>{{ source.brand }}</td>
              <td>
                <code>···· ···· ···· {{ source.last4 }}</code>
              </td>
              <td class="text text--align-right">
                <router-link
                  :to="
                    `/manage/${$route.params.team}/billing/sources/${source.id}`
                  "
                  aria-label="Edit"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                >
                  <font-awesome-icon
                    class="icon"
                    icon="pencil-alt"
                    fixed-width
                  />
                </router-link>
                <button
                  aria-label="Delete"
                  data-balloon-pos="up"
                  class="button button--type-icon button--color-danger"
                  @click="() => (showDelete = source)"
                >
                  <font-awesome-icon class="icon" icon="trash" fixed-width />
                </button>
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
            <span>Load more credit cards</span>
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
      <Loading v-else-if="loading" :message="loading" />
      <h2>Add card</h2>
      <p>You can use <code>42</code> 16 times as a test credit card.</p>
      <form @submit.prevent="addCard">
        <div class="row">
          <Input
            :value="newCard.name"
            label="Name"
            placeholder="Enter your name on card"
            @input="val => (newCard.name = val)"
          />
          <Input
            :value="newCard.number"
            label="Number"
            placeholder="Enter your credit card number"
            required
            @input="val => (newCard.number = val)"
          />
        </div>
        <div class="row">
          <Select
            :value="newCard.exp_month"
            label="Expiry month"
            :options="months"
            required
            @input="val => (newCard.exp_month = val)"
          />
          <Select
            :value="newCard.exp_year"
            label="Expiry year"
            :options="years"
            required
            @input="val => (newCard.exp_year = val)"
          />
          <Input
            :value="newCard.cvc"
            label="CVC/CVV"
            type="number"
            placeholder="Enter your verification code"
            min="100"
            max="9999"
            @input="val => (newCard.cvc = val)"
          />
        </div>
        <button class="button">Add credit card</button>
      </form>
    </div>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to delete this credit card?</h2>
        <p>
          Deleting an credit card is not reversible, and if you don't add
          another payment method, your subscription may be cancelled.
        </p>
        <button
          class="button button--color-danger button--state-cta"
          @click="deleteCard(showDelete.id)"
        >
          Yes, delete credit card
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
  faPencilAlt,
  faArrowDown,
  faSync,
  faCloudDownloadAlt,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import Confirm from "@/components/Confirm.vue";
import Loading from "@/components/Loading.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Sources, emptyPagination } from "@/types/manage";
import en from "@/locales/en";
library.add(faPencilAlt, faCloudDownloadAlt, faArrowDown, faSync, faTrash);
const months = en.months;

@Component({
  components: {
    Loading,
    TimeAgo,
    Input,
    Confirm,
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
  showDelete = null;
  loading = "";
  newCard = {
    object: "card",
    number: "",
    exp_month: 1,
    exp_year: new Date().getUTCFullYear() + 5,
    name: ""
  };
  months = months;
  years: number[] = [];

  private created() {
    this.sources = {
      ...this.$store.getters["manage/sources"](this.$route.params.team)
    };
    for (let i = 0; i < 20; i++) {
      this.years.push(new Date().getUTCFullYear() + i);
    }
  }

  private load() {
    this.loading = "Loading your credit cards";
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

  private addCard() {
    this.loading = "Adding your credit card";
    this.$store
      .dispatch("manage/createSource", {
        team: this.$route.params.team,
        ...this.newCard
      })
      .then(sources => {
        this.sources = { ...sources };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => {
        this.loading = "";
        this.newCard = {
          object: "card",
          number: "",
          exp_month: 1,
          exp_year: new Date().getUTCFullYear() + 5,
          name: ""
        };
      });
  }

  private deleteCard(id: string) {
    this.showDelete = null;
    this.loading = "Deleting your credit card";
    this.$store
      .dispatch("manage/deleteSource", {
        team: this.$route.params.team,
        id
      })
      .then(sources => {
        this.sources = { ...sources };
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") this.noBilling = true;
      })
      .finally(() => {
        this.loading = "";
      });
  }
}
</script>

<style lang="scss" scoped></style>
