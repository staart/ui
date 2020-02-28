<template>
  <div class="container container--type-settings">
    <aside>
      <BillingSidebar />
    </aside>
    <main class="card">
      <Loading v-if="loading" :message="loading" />
      <div v-else>
        <div class="row">
          <div>
            <nuxt-link
              :to="`/teams/${$route.params.team}/billing/sources`"
              aria-label="Back"
              data-balloon-pos="down"
              class="button button--type-icon button--type-back"
            >
              <font-awesome-icon class="icon" icon="arrow-left" fixed-width />
            </nuxt-link>
            <h1>Your card</h1>
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
        <LargeMessage
          v-if="!loading && !source"
          heading="Source not found"
          img="undraw_credit_card_payment_yb88.svg"
          text="We couldn't find this source for you."
        />
        <div v-else-if="source">
          <table class="table table--type-cols">
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <code>{{ source.id }}</code>
                </td>
              </tr>
              <tr>
                <td>Fingerprint</td>
                <td>
                  <code>{{ source.fingerprint }}</code>
                </td>
              </tr>
              <tr>
                <td>Number</td>
                <td>
                  <code>···· ···· ···· {{ source.last4 }}</code>
                </td>
              </tr>
              <tr>
                <td>Brand</td>
                <td>{{ source.brand }}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td><Country :code="source.country" /></td>
              </tr>
            </tbody>
          </table>
          <form @submit.prevent="updateCard">
            <div class="row">
              <Input
                :value="source.name"
                label="Name"
                placeholder="Enter your name on card"
                @input="val => (source.name = val)"
              />
            </div>
            <div class="row">
              <Select
                :value="source.exp_month"
                label="Expiry month"
                :options="months"
                required
                @input="val => (source.exp_month = val)"
              />
              <Select
                :value="source.exp_year"
                label="Expiry year"
                :options="years"
                required
                @input="val => (source.exp_year = val)"
              />
            </div>
            <button class="button">Update card</button>
            <button
              type="button"
              class="button button--color-danger"
              style="margin-left: 1rem"
              @click.prevent="() => (showDelete = true)"
            >
              Delete card
            </button>
          </form>
        </div>
      </div>
      <transition name="modal">
        <Confirm v-if="showDelete" :on-close="() => (showDelete = false)">
          <h2>Are you sure you want to delete this credit card?</h2>
          <p>
            Deleting an credit card is not reversible, and if you don't add
            another payment method, your subscription may be cancelled.
          </p>
          <button
            class="button button--color-danger button--state-cta"
            @click="deleteCard()"
          >
            Yes, delete credit card
          </button>
          <button type="button" class="button" @click="showDelete = false">
            No, don't delete
          </button>
        </Confirm>
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { getAllCountries } from "countries-and-timezones";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faSync } from "@fortawesome/free-solid-svg-icons";
import { sources, cards } from "stripe";
import Confirm from "@/components/Confirm.vue";
import Loading from "@/components/Loading.vue";
import BillingSidebar from "@/components/sidebars/Billing.vue";
import TimeAgo from "@/components/TimeAgo.vue";
import Country from "@/components/Country.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Select from "@/components/form/Select.vue";
import { User } from "@/types/auth";
import { Sources, emptyPagination } from "@/types/manage";
import en from "@/locales/en";
library.add(faArrowLeft, faSync);
const months = en.months;

@Component({
  components: {
    Loading,
    TimeAgo,
    Input,
    BillingSidebar,
    Confirm,
    Country,
    FontAwesomeIcon,
    Select,
    LargeMessage,
    Checkbox
  },
  middleware: "auth"
})
export default class ManageSettings extends Vue {
  source?: cards.ICardUpdateOptions;
  months = months;
  loadingMore = false;
  loading = "";
  showDelete = false;
  years: number[] = [];

  private created() {
    this.source = {
      ...this.$store.getters["manage/source"](
        this.$route.params.team,
        this.$route.params.id
      )
    };
    for (let i = 0; i < 20; i++) {
      this.years.push(new Date().getUTCFullYear() + i);
    }
  }

  private mounted() {
    this.load();
  }

  private load() {
    this.loading = "Loading your credit card";
    this.$store
      .dispatch("manage/getSource", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(source => {
        this.source = { ...source };
      })
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private updateCard() {
    this.loading = "Updating your credit card";
    this.$store
      .dispatch("manage/updateSource", {
        team: this.$route.params.team,
        id: this.$route.params.id,
        ...(this.source && {
          name: this.source.name,
          exp_month: this.source.exp_month,
          exp_year: this.source.exp_year
        })
      })
      .then(() => {})
      .catch(() => {})
      .finally(() => (this.loading = ""));
  }

  private deleteCard() {
    this.showDelete = false;
    this.loading = "Deleting your credit card";
    this.$store
      .dispatch("manage/deleteSource", {
        team: this.$route.params.team,
        id: this.$route.params.id
      })
      .then(source => {
        this.source = { ...source };
      })
      .catch(error => {
        throw new Error(error);
      })
      .finally(() => {
        this.loading = "";
        this.$router.push(`/teams/${this.$route.params.team}/billing/sources`);
      });
  }
}
</script>
