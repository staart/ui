<template>
  <main>
    <Manage>
      <largeMessage
        v-if="noBilling"
        heading="No billing account"
        text="You need to setup a billing account before you can view payment methods."
        cta-text="Setup billing"
        cta-to="/manage/billing"
      />
      <div v-else>
        <h1>Payment method</h1>
        <Loading v-if="loading" :message="loading" />
        <div v-else>
          <table class="table table--type-cols">
            <tbody>
              <tr>
                <td>Number</td>
                <td>•••• •••• •••• {{ card.last4 }}</td>
              </tr>
              <tr>
                <td>Expiry</td>
                <td>{{ months[card.exp_month] }} {{ card.exp_year }}</td>
              </tr>
              <tr>
                <td>Card type</td>
                <td style="text-transform: capitalize">
                  {{ card.brand }} {{ card.funding }} {{ card.object }}
                </td>
              </tr>
              <tr>
                <td>Fingerprint</td>
                <td>
                  <code>{{ card.fingerprint }}</code>
                </td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{{ card.country }}</td>
              </tr>
              <tr>
                <td>CVV approved</td>
                <td>
                  <font-awesome-icon
                    v-if="card.cvc_check === 'pass'"
                    title="Yes"
                    class="icon icon--color-success"
                    icon="check-circle"
                    fixed-width
                  />
                  <font-awesome-icon
                    v-else
                    title="No"
                    class="icon icon--color-danger"
                    icon="times-circle"
                    fixed-width
                  />
                </td>
              </tr>
              <tr>
                <td>Dynamic card number</td>
                <td>
                  <font-awesome-icon
                    v-if="card.dynamic_last4"
                    title="Yes"
                    class="icon icon--color-success"
                    icon="check-circle"
                    fixed-width
                  />
                  <font-awesome-icon
                    v-else
                    title="No"
                    class="icon icon--color-danger"
                    icon="times-circle"
                    fixed-width
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <h2>Edit card</h2>
          <form @submit.prevent="editCard">
            <div class="row">
              <Input
                :value="newCardName"
                label="Name on card"
                placeholder="Enter your full name as on card"
                required
                @input="val => (newCardName = val)"
              />
            </div>
            <div class="row">
              <Select
                :value="newCardExpMonth"
                label="Expiry month"
                :options="months"
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
            </div>
            <button class="button">Update credit card</button>
            <button
              class="button button--color-danger"
              style="margin-left: 0.5rem"
              type="button"
              @click.prevent="showDelete = card"
            >
              Delete this card
            </button>
          </form>
        </div>
      </div>
    </Manage>
    <transition name="modal">
      <Confirm v-if="showDelete" :on-close="() => (showDelete = null)">
        <h2>Are you sure you want to remove this card?</h2>
        <p>
          Removing a card is not reversible, and you'll have to add another card
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
import Confirm from "@/components/Confirm.vue";
import LargeMessage from "@/components/LargeMessage.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import { getAllCountries } from "countries-and-timezones";
import { User } from "@/types/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
library.add(faCheckCircle, faTimesCircle);

@Component({
  components: {
    Manage,
    Loading,
    Confirm,
    Input,
    Select,
    LargeMessage,
    Checkbox,
    FontAwesomeIcon
  },
  computed: mapGetters({
    organization: "auth/activeOrganization",
    user: "auth/user"
  })
})
export default class ManageSettings extends Vue {
  organization!: any;
  user!: any;
  card: any = {};
  loading = "";
  noBilling = false;
  years: number[] = [];
  showDelete = null;
  months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };

  newCardExpMonth = 1;
  newCardExpYear = new Date().getUTCFullYear() + 5;
  newCardName = "";

  private created() {
    const years: number[] = [];
    for (let i = 0; i < 15; i++) {
      years.push(new Date().getUTCFullYear() + i);
    }
    this.years = years;
  }

  private mounted() {
    this.loading = "Loading card details";
    this.$store
      .dispatch("manage/getSource", {
        id: this.organization.organization.id,
        sourceId: this.$route.params.id
      })
      .then(card => {
        this.card = card;
        this.newCardExpMonth = card.exp_month;
        this.newCardExpYear = card.exp_year;
        this.newCardName = card.name;
      })
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.noBilling = true;
        }
      })
      .finally(() => (this.loading = ""));
  }

  private deleteCard() {
    this.showDelete = null;
    this.loading = "Deleting your card";
    this.$store
      .dispatch("manage/deleteSource", {
        id: this.organization.organization.id,
        sourceId: this.$route.params.id
      })
      .then(subscriptions => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.noBilling = true;
        }
      })
      .finally(() => {
        this.loading = "";
        this.$router.push("/manage/sources");
      });
  }

  private editCard() {
    this.loading = "Updating your card";
    this.$store
      .dispatch("manage/updateSource", {
        id: this.organization.organization.id,
        sourceId: this.$route.params.id,
        exp_month: this.newCardExpMonth,
        exp_year: this.newCardExpYear,
        name: this.newCardName
      })
      .then(() => {})
      .catch(error => {
        if (error.response.data.error === "no-customer") {
          this.noBilling = true;
        }
      })
      .finally(() => {
        this.loading = "";
        this.newCardExpMonth = 1;
        this.newCardExpYear = new Date().getUTCFullYear() + 5;
        this.newCardName = "";
        this.$router.push("/manage/sources");
      });
  }
}
</script>

<style lang="scss" scoped></style>
