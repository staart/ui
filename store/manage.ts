import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, Organization, emptyPagination } from "~/types/manage";
import download from "downloadjs";
import Vue from "vue";

const stripeProductId = "prod_CtJZklN9W4QmxA";
export const state = (): RootState => ({
  memberships: {},
  isDownloading: false,
  organizations: {},
  billing: {},
  subscriptions: {},
  subscription: {},
  invoices: {},
  invoice: {}
});

export const mutations: MutationTree<RootState> = {
  setOrganization(state: RootState, organization: Organization): void {
    const organizations = state.organizations;
    organizations[organization.id] = organization;
    Vue.set(state, "organizations", organizations);
  },
  setMembers(state: RootState, { team, members, start, next }): void {
    const currentMembers = state.memberships;
    currentMembers[team] = currentMembers[team] || emptyPagination;
    if (start) {
      currentMembers[team].data = [...currentMembers[team].data, ...members.data];
    } else {
      currentMembers[team].data = members.data;
    }
    currentMembers[team].next = next;
    Vue.set(state, "memberships", currentMembers);
  },
  setBilling(state: RootState, { billing, team }): void {
    const currentBilling = state.billing;
    currentBilling[team] = billing;
    Vue.set(state, "billing", currentBilling);
  },
  setSubscriptions(state: RootState, { team, subscriptions, start, next }): void {
    const currentSubscriptions = state.subscriptions;
    currentSubscriptions[team] = currentSubscriptions[team] || emptyPagination;
    if (start) {
      currentSubscriptions[team].data = [...currentSubscriptions[team].data, ...subscriptions.data];
    } else {
      currentSubscriptions[team].data = subscriptions.data;
    }
    currentSubscriptions[team].next = next;
    Vue.set(state, "subscriptions", currentSubscriptions);
  },
  setSubscription(state: RootState, { team, subscription, id }): void {
    const currentSubscriptions = state.subscription;
    currentSubscriptions[team] = currentSubscriptions[team] || {};
    currentSubscriptions[team][id] = { ...subscription };
    Vue.set(state, "subscription", currentSubscriptions);
  },
  setInvoices(state: RootState, { team, invoices, start, next }): void {
    const currentInvoices = state.invoices;
    currentInvoices[team] = currentInvoices[team] || emptyPagination;
    if (start) {
      currentInvoices[team].data = [...currentInvoices[team].data, ...invoices.data];
    } else {
      currentInvoices[team].data = invoices.data;
    }
    currentInvoices[team].next = next;
    Vue.set(state, "invoices", currentInvoices);
  },
  setInvoice(state: RootState, { team, invoice, id }): void {
    const currentInvoices = state.invoice;
    currentInvoices[team] = currentInvoices[team] || {};
    currentInvoices[team][id] = { ...invoice };
    Vue.set(state, "invoice", currentInvoices);
  },
  setPricingPlans(state: RootState, pricingPlans: any): void {
    Vue.set(state, "pricingPlans", pricingPlans);
  },
  setSources(state: RootState, sources: any): void {
    Vue.set(state, "sources", sources);
  },
  setRecentEvents(state: RootState, recentEvents: any): void {
    Vue.set(state, "recentEvents", recentEvents);
  },
  startDownloading(state: RootState): void {
    state.isDownloading = true;
  },
  stopDownloading(state: RootState): void {
    state.isDownloading = false;
  },
  clearAll(state: RootState): void {
    delete state.organizations;
    delete state.billing;
    delete state.memberships;
    delete state.membership;
    delete state.subscriptions;
    delete state.subscription;
    delete state.invoices;
    delete state.invoice;
    delete state.recentEvents;
    delete state.pricingPlans;
    delete state.sources;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async getOrganization({ commit }, context) {
    const org: Organization = (await this.$axios.get(
      `/organizations/${context}`
    )).data;
    commit("setOrganization", org);
    return org;
  },
  async updateOrganization({ dispatch }, context) {
    const update = { ...context };
    delete update.team;
    await this.$axios.patch(`/organizations/${context.team}`, update);
    return dispatch("getOrganization", context.team);
  },
  async deleteOrganization({ commit, rootGetters }) {
    const org = rootGetters["auth/activeOrganization"];
    const organizationId = org.organizationId;
    await this.$axios.delete(`/organizations/${organizationId}`);
    commit("clearAll");
  },
  async getExport({ commit, rootGetters }) {
    commit("startDownloading");
    const org = rootGetters["auth/activeOrganization"];
    const organizationId = org.organizationId;
    const data = (await this.$axios.get(
      `/organizations/${organizationId}/data`
    )).data;
    download(
      JSON.stringify(data, null, 2),
      `export-${new Date().getTime()}.json`,
      "application/json"
    );
    commit("stopDownloading");
  },
  async getMembers({ commit }, { team, start = 0 }) {
    const members = (await this.$axios.get(
      `/organizations/${team}/memberships?start=${start}`
    )).data;
    commit("setMembers", { team, members, start, next: members.next });
    return members;
  },
  async inviteMember({ dispatch, rootGetters }, context) {
    const toInvite = { ...context };
    delete toInvite.team;
    await this.$axios.put(
      `/organizations/${context.team}/memberships`,
      toInvite
    );
    return dispatch("getMembers", { team: context.team });
  },
  async deleteMembership({ dispatch }, { id, team }) {
    await this.$axios.delete(`/memberships/${id}`);
    return dispatch("getMembers", { team });
  },
  async getMembership(actions, context) {
    return (await this.$axios.get(`/memberships/${context}`)).data;
  },
  async updateMembership({ dispatch }, context) {
    const data = JSON.parse(JSON.stringify(context));
    delete data.id;
    await this.$axios.patch(`/memberships/${context.id}`, data);
    return dispatch("getMembership", context.id);
  },
  async getBilling({ commit }, team) {
    const billing: any = (await this.$axios.get(
      `/organizations/${team}/billing`
    )).data;
    commit("setBilling", { billing, team });
    return billing;
  },
  async updateBilling({ dispatch }, context) {
    const data = JSON.parse(JSON.stringify(context));
    delete data.team;
    await this.$axios.patch(`/organizations/${context.team}/billing`, data);
    return dispatch("getBilling", context.team);
  },
  async getInvoices({ commit }, { team, start = 0 }) {
    const invoices: any = (await this.$axios.get(
      `/organizations/${team}/invoices?start=${start}`
    )).data;
    commit("setInvoices", { team, invoices, start, next: invoices.next });
    return invoices;
  },
  async getInvoice({ commit }, { team, id }) {
    const invoice: any = (await this.$axios.get(
      `/organizations/${team}/invoices/${id}`
    )).data;
    commit("setInvoice", { team, invoice, id });
    return invoice;
  },
  async getSubscriptions({ commit }, { team, start = 0 }) {
    const subscriptions: any = (await this.$axios.get(
      `/organizations/${team}/subscriptions?start=${start}`
    )).data;
    commit("setSubscriptions", { team, subscriptions, start, next: subscriptions.next });
    return subscriptions;
  },
  async getSubscription({ commit }, { team, id }) {
    const subscription: any = (await this.$axios.get(
      `/organizations/${team}/subscriptions/${id}`
    )).data;
    commit("setSubscription", { team, subscription, id });
    return subscription;
  },
  async editSubscription({ dispatch }, context) {
    const data = { ...context };
    delete data.id;
    delete data.team;
    await this.$axios.patch(
      `/organizations/${context.team}/subscriptions/${context.id}`,
      data
    );
    return dispatch("getSubscription", { team: context.team, id: context.id });
  },
  async createSubscription({ dispatch }, { team, plan }) {
    await this.$axios.put(
      `/organizations/${team}/subscriptions`, { plan }
    );
    return dispatch("getSubscriptions", { team });
  },
  async getPricingPlans({ commit }, context) {
    const subscriptions: any = (await this.$axios.get(
      `/organizations/${context}/pricing/${stripeProductId}`
    )).data;
    commit("setPricingPlans", subscriptions);
  },
  async getSources({ commit }, context) {
    const sources: any = (await this.$axios.get(
      `/organizations/${context}/sources`
    )).data;
    commit("setSources", sources);
  },
  async createSource({ dispatch }, context) {
    const data = JSON.parse(JSON.stringify(context));
    delete data.id;
    await this.$axios.put(`/organizations/${context.id}/sources`, data);
    return dispatch("getSources", context.id);
  },
  async getSource(actions, context) {
    return (await this.$axios.get(
      `/organizations/${context.id}/sources/${context.sourceId}`
    )).data;
  },
  async deleteSource({ dispatch }, context) {
    await this.$axios.delete(
      `/organizations/${context.id}/sources/${context.sourceId}`
    );
    return dispatch("getSources", context.id);
  },
  async updateSource({ dispatch }, context) {
    const data = JSON.parse(JSON.stringify(context));
    delete data.id;
    delete data.sourceId;
    await this.$axios.patch(
      `/organizations/${context.id}/sources/${context.sourceId}`,
      data
    );
    return dispatch("getSource", context);
  },
  async getEvents({ commit, rootGetters }) {
    const org = rootGetters["auth/activeOrganization"];
    const organizationId = org.organizationId;
    const events: any = (await this.$axios.get(
      `/organizations/${organizationId}/events`
    )).data;
    commit("setRecentEvents", events);
  }
};

export const getters: GetterTree<RootState, RootState> = {
  membership: state => state.membership,
  pricingPlans: state => state.pricingPlans,
  securityEvents: state => state.recentEvents,
  isDownloading: state => state.isDownloading,
  sources: state => state.sources,
  memberships: state => (orgId: string) => state.memberships[parseInt(orgId)],
  billing: state => (orgId: string) => state.billing[parseInt(orgId)],
  subscriptions: state => (orgId: string) => state.subscriptions[parseInt(orgId)],
  subscription: state => (orgId: string, subscriptionId: string) => state.subscription[parseInt(orgId)] && state.subscription[parseInt(orgId)][subscriptionId],
  invoices: state => (orgId: string) => state.invoices[parseInt(orgId)],
  invoice: state => (orgId: string, invoiceId: string) => state.invoice[parseInt(orgId)] && state.invoice[parseInt(orgId)][invoiceId],
  organization: state => (orgId: string) => state.organizations[parseInt(orgId)]
};
