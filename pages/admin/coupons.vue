<template>
  <div>
    <h1 class="is-size-4 mb-4">Coupon codes</h1>
    <b-table
      :loading="loading"
      :data="coupons.data"
      :opened-detailed="opened"
      detailed
      detail-key="id"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
    >
      <b-table-column v-slot="props" sortable field="code" label="Coupon code">
        <code>{{ props.row.code }}</code>
        <b-tooltip v-if="props.row.maxUses === props.row.usedCount" label="Used">
          <b-icon icon="credit-card-off" type="is-danger" />
        </b-tooltip>
      </b-table-column>
      <b-table-column v-slot="props" label="Amount">
        {{ currencies[props.row.currency] || props.row.currency
        }}{{ props.row.amount / 100 }}
      </b-table-column>
      <b-table-column v-slot="props" sortable field="expiresAt" label="Expires">
        <span v-if="props.row.expiresAt">
          {{
          new Date(props.row.expiresAt).toLocaleDateString()
          }}
        </span>
        <span v-else>
          <em>Never</em>
        </span>
      </b-table-column>
      <b-table-column v-slot="props" cell-class="has-text-right">
        <b-tooltip label="Edit">
          <b-button type="is-primary" icon-right="pencil" @click="addToOpened(props.row.id)" />
        </b-tooltip>
        <b-tooltip label="Delete">
          <b-button
            type="is-danger"
            icon-right="delete"
            @click="deleteCoupon(props.row.id, props.row.code)"
          />
        </b-tooltip>
      </b-table-column>
      <template slot="detail" slot-scope="props" v-if="props.row">
        <form @submit.prevent="save(props.row)">
          <b-field label="Currency">
            <div class="field">
              <b-radio
                v-for="(symbol, value) in currencies"
                :key="`c${value}`"
                @input="val => updateValue(props.row.id, 'currency', val)"
                name="name"
                :native-value="value"
              >{{ value.toUpperCase() }}</b-radio>
            </div>
          </b-field>
          <b-field label="Amount">
            <b-input
              type="number"
              :value="props.row.amount"
              @input="val => updateValue(props.row.id, 'amount', val)"
            />
          </b-field>
          <b-field label="Coupon code">
            <b-input
              type="text"
              :value="props.row.code"
              @input="val => updateValue(props.row.id, 'code', val)"
            />
          </b-field>
          <b-field label="Description">
            <b-input
              type="text"
              :value="props.row.description"
              @input="val => updateValue(props.row.id, 'description', val)"
            />
          </b-field>
          <b-field label="Max uses">
            <b-input
              type="number"
              :value="props.row.maxUses"
              @input="val => updateValue(props.row.id, 'maxUses', val)"
            />
          </b-field>
          <b-field label="Team restriction">
            <b-select
              :value="props.row.teamRestrictions"
              @input="val => updateValue(props.row.id, 'teamRestrictions', val)"
              :loading="loadingTeams"
              expanded
            >
              <option :value="null">All teams can use</option>
              <option
                v-for="team in teams.data"
                :value="team.id"
                :key="`t${team.id}`"
              >{{ team.name }}</option>
            </b-select>
          </b-field>
          <b-button type="is-primary" native-type="submit" :loading="loadingSave">Update coupon</b-button>
          <b-button @click.prevent="removeFromOpened(props.row.id)">Cancel</b-button>
        </form>
      </template>
    </b-table>
    <div class="has-text-centered">
      <b-button
        v-if="coupons.hasMore"
        @click="get"
        icon-right="arrow-down"
        :loading="loading"
      >Load more coupons</b-button>
    </div>
    <h2 class="is-size-5 mb-3">Add coupon</h2>
    <p>
      Generate a new coupon code to share with teams. Make sure the amount is in
      basic monetary units like cents or paise (multiply by 100).
    </p>
    <form @submit.prevent="add">
      <div class="columns">
        <b-field label="Currency" class="column">
          <div class="field">
            <b-radio
              v-for="(symbol, value) in currencies"
              :key="`c${value}`"
              v-model="currency"
              name="name"
              :native-value="value"
            >{{ value.toUpperCase() }}</b-radio>
          </div>
        </b-field>
        <b-field label="Amount" class="column">
          <b-input type="number" v-model="amount" required />
        </b-field>
      </div>
      <div class="columns">
        <b-field label="Team restriction" class="column">
          <b-select v-model="teamRestrictions" :loading="loadingTeams" expanded>
            <option :value="null">All teams can use</option>
            <option v-for="team in teams.data" :value="team.id" :key="`t${team.id}`">{{ team.name }}</option>
          </b-select>
        </b-field>
        <b-field label="Max uses" class="column">
          <b-input type="number" v-model="maxUses" />
        </b-field>
      </div>
      <b-field>
        <b-checkbox v-model="jwt">Create JWT coupon code</b-checkbox>
      </b-field>
      <b-field>
        <b-checkbox v-model="expires">Add coupon expiry time</b-checkbox>
      </b-field>
      <b-field label="Expiry" v-if="expires">
        <b-datepicker
          placeholder="Click to select..."
          icon="calendar-today"
          trap-focus
          v-model="expiresAt"
        />
      </b-field>
      <b-field>
        <b-checkbox v-model="hasCode">Add coupon code</b-checkbox>
      </b-field>
      <b-field label="Coupon code" v-if="hasCode">
        <b-input type="text" v-model="code" />
      </b-field>
      <b-button type="is-primary" native-type="submit" :loading="loadingAdd">
        Add coupon for {{ currencies[currency] || currency
        }}{{ amount / 100 }}
      </b-button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  middleware: "authenticated",
  layout: "admin",
})
export default class AdminHome extends Vue {
  loading = false;
  loadingSave = false;
  loadingAdd = false;
  loadingTeams = false;
  expires = false;
  hasCode = false;
  opened: number[] = [];
  teams: any = { data: [] };
  coupons: any = { data: [] };

  amount = "100";
  code = "";
  maxUses = "";
  teamRestrictions = null;
  currency = "usd";
  expiresAt = new Date();
  jwt = false;
  description = "";

  currencies = {
    usd: "$",
    eur: "€",
    inr: "₹",
  };

  async mounted() {
    this.getTeams();
    return this.get();
  }

  async get() {
    this.loading = true;
    try {
      const { data } = await this.$axios.get(
        `/admin/coupons?take=10${
          this.coupons.data.length
            ? `&after=${this.coupons.data[this.coupons.data.length - 1].id}`
            : ""
        }`
      );
      this.coupons.data.push(...(data.data || []));
      this.coupons.hasMore = data.hasMore;
      this.coupons = data;
    } catch (error) {}
    this.loading = false;
  }

  async getTeams() {
    this.loadingTeams = true;
    try {
      const { data } = await this.$axios.get(
        `/admin/groups?take=100${
          this.teams.data.length
            ? `&after=${this.teams.data[this.teams.data.length - 1].id}`
            : ""
        }`
      );
      this.teams.data.push(...(data.data || []));
      this.teams.hasMore = data.hasMore;
      this.teams = data;
    } catch (error) {}
    this.loadingTeams = false;
  }

  async add() {
    this.loadingAdd = true;
    try {
      const { data } = await this.$axios.put("/admin/coupons", {
        amount: parseInt(this.amount),
        maxUses: this.maxUses ? parseInt(this.maxUses) : undefined,
        teamRestrictions: this.teamRestrictions
          ? String(this.teamRestrictions)
          : undefined,
        code: this.code || undefined,
        currency: this.currency,
        jwt: this.jwt,
        expiresAt: this.expires ? this.expiresAt : undefined,
        description: this.description || undefined,
      });
      if (typeof data.added === "string") {
        alert(data.added);
      } else {
        this.coupons.data.push(data.added);
      }
      this.code = "";
      this.amount = "100";
      this.maxUses = "";
      this.teamRestrictions = null;
      this.currency = "usd";
      this.jwt = false;
      this.expires = false;
      this.hasCode = false;
      this.description = "";
      this.expiresAt = new Date();
    } catch (error) {}
    this.loadingAdd = false;
  }

  async deleteCoupon(id: number, code: string) {
    this.$buefy.dialog.confirm({
      title: "Deleting coupon",
      message: `Are you sure you want to delete the coupon with code <code>${code}</code>? This action is not reversible, and this coupon will stop working immediately.`,
      confirmText: "Yes, delete coupon",
      cancelText: "No, don't delete",
      type: "is-danger",
      hasIcon: true,
      trapFocus: true,
      onConfirm: async () => {
        this.loading = true;
        try {
          await this.$axios.delete(`/admin/coupons/${id}`);
        } catch (error) {}
        return this.get();
      },
    });
  }

  async save(data: any) {
    this.loadingSave = true;
    try {
      await this.$axios.patch(`/admin/coupons/${data.id}`, {
        currency: data.currency,
        amount: data.amount ? parseInt(data.amount) : undefined,
        code: data.code,
        description: data.description,
        maxUses: data.maxUses ? parseInt(data.maxUses) : undefined,
        teamRestrictions: data.teamRestrictions,
      });
      this.removeFromOpened(data.id);
    } catch (error) {}
    this.loadingSave = false;
    this.coupons = { data: [] };
    return this.get();
  }

  addToOpened(id: number) {
    if (!this.opened.includes(id)) this.opened.push(id);
  }

  removeFromOpened(id: number) {
    this.opened = this.opened.filter((i) => i !== id);
  }

  updateValue(id: number, key: string, value: any) {
    this.coupons.data = this.coupons.data.map((i: any) => {
      if (i.id === id) {
        i[key] = value;
      }
      return i;
    });
  }
}
</script>
