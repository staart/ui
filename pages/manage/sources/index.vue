<template>
  <main>
    <Manage>
      <h1>Payment methods</h1>
      <Loading v-if="loading" :message="loading" />
      <div v-else-if="sources && sources.data && sources.data.length">
        <table class="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Number</th>
              <th>Network</th>
              <th>Name on card</th>
              <th>Country</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(source, index) in sources.data"
              :key="`${source.id}_${index}`"
            >
              <td style="text-transform: capitalize">
                {{ source.funding }} {{ source.object }}
              </td>
              <td>
                •••• •••• ••••
                {{ source.last4 }}
              </td>
              <td>
                {{ source.brand }}
              </td>
              <td>
                {{ source.name }}
              </td>
              <td>
                {{ source.country }}
              </td>
              <td class="text text--align-right">
                <router-link
                  data-balloon="Edit"
                  data-balloon-pos="up"
                  class="button button--type-icon"
                  :to="`/manage/sources/${source.id}`"
                >
                  <font-awesome-icon
                    title="Edit"
                    icon="pencil-alt"
                    fixed-width
                  />
                </router-link>
                <button
                  data-balloon="Delete"
                  data-balloon-pos="up"
                  class="button button--color-danger button--type-icon"
                  @click="showDelete = source"
                >
                  <font-awesome-icon
                    title="Delete"
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
      <h2>Add card</h2>
      <Loading v-if="addingCard" :message="addingCard" />
      <form v-else @submit.prevent="addCard">
        <div class="row">
          <Input
            :value="newCardName"
            label="Name on card"
            placeholder="Enter your full name as on card"
            required
            @input="val => (newCardName = val)"
          />
          <Input
            :value="newCardNumber"
            label="Credit card number"
            placeholder="Enter your credit card number (16 digits)"
            required
            @input="val => (newCardNumber = val)"
          />
        </div>
        <div class="row">
          <Select
            :value="newCardExpMonth"
            label="Expiry month"
            :options="{
              '01': 'January',
              '02': 'February',
              '03': 'March',
              '04': 'April',
              '05': 'May',
              '06': 'June',
              '07': 'July',
              '08': 'August',
              '09': 'September',
              '10': 'October',
              '11': 'November',
              '12': 'December'
            }"
            required
            @input="val => (newCardExpMonth = val)"
          />
          <Select
            :value="newCardExpYear"
            label="Expiry year"
            :options="years"
            required
            @input="val => (newCardExpYear = val)"
          />
          <Input
            :value="newCardCvv"
            label="CVV"
            placeholder="Enter your security code"
            required
            @input="val => (newCardCvv = val)"
          />
        </div>
        <button class="button">Add credit card</button>
      </form>
    </Manage>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to remove this card?</h2>
        <p>
          Removing a card is not reversable, and you'll have to add another card
          if you change your mind. If you have any pending charges, your
          subscription might be cancelled without a payment method.
        </p>
        <button
          class="button button--color-danger-cta"
          @click="deleteCard(showDelete.id)"
        >
          Yes, remove this card
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
import Manage from "@/components/Manage.vue";
import Loading from "@/components/Loading.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Confirm from "@/components/Confirm.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
library.add(faTrash, faPencilAlt);

@Component({
  components: {
    Manage,
    Loading,
    Input,
    Select,
    LargeMessage,
    Checkbox,
    Confirm,
    FontAwesomeIcon
  },
  computed: mapGetters({
    organization: "auth/activeOrganization",
    user: "auth/user",
    sources: "manage/sources"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  sources!: any;
  user!: any;
  loading = "";
  addingCard = "";
  years: number[] = [];
  showDelete = null;

  newCardNumber = "";
  newCardExpMonth = "01";
  newCardExpYear = new Date().getUTCFullYear() + 5;
  newCardCvv = "";
  newCardName = "";

  private created() {
    const years: number[] = [];
    for (let i = 0; i < 15; i++) {
      years.push(new Date().getUTCFullYear() + i);
    }
    this.years = years;
  }

  private mounted() {
    this.loading = "Loading your cards";
    this.$store
      .dispatch("manage/getSources", this.organization.organization.id)
      .then(subscriptions => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.$router.replace("/manage/billing");
        }
      })
      .finally(() => (this.loading = ""));
  }

  private deleteCard(sourceId: number) {
    this.showDelete = null;
    this.loading = "Deleting your card";
    this.$store
      .dispatch("manage/deleteSource", {
        id: this.organization.organization.id,
        sourceId
      })
      .then(subscriptions => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.$router.replace("/manage/billing");
        }
      })
      .finally(() => (this.loading = ""));
  }

  private addCard() {
    this.addingCard = "Adding your card";
    this.$store
      .dispatch("manage/createSource", {
        id: this.organization.organization.id,
        number: this.newCardNumber,
        exp_month: this.newCardExpMonth,
        exp_year: this.newCardExpYear,
        cvc: this.newCardCvv,
        name: this.newCardName
      })
      .then(() => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.$router.replace("/manage/billing");
        }
      })
      .finally(() => {
        this.addingCard = "";
        this.newCardNumber = "";
        this.newCardExpMonth = "01";
        this.newCardExpYear = new Date().getUTCFullYear() + 5;
        this.newCardCvv = "";
        this.newCardName = "";
      });
  }
}
</script>

<style lang="scss" scoped></style>
