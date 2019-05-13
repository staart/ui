import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, Organization, Member } from "~/types/manage";
import download from "downloadjs";
import Vue from "vue";

const stripeProductId = "prod_CtJZklN9W4QmxA";
export const state = (): RootState => ({
  members: [],
  isDownloading: false
});

export const mutations: MutationTree<RootState> = {
  setOrganization(state: RootState, organization: Organization): void {
    Vue.set(state, "organization", organization);
  },
  setMembers(state: RootState, members: Member[]): void {
    Vue.set(state, "members", members);
  },
  setBilling(state: RootState, billing: any): void {
    Vue.set(state, "billing", billing);
  },
  setInvoices(state: RootState, invoices: any): void {
    Vue.set(state, "invoices", invoices);
  },
  setSubscriptions(state: RootState, subscriptions: any): void {
    Vue.set(state, "subscriptions", subscriptions);
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
    delete state.organization;
    delete state.billing;
    delete state.invoices;
    delete state.members;
    delete state.membership;
    delete state.subscriptions;
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
  },
  async updateOrganization({ dispatch, rootGetters }, context) {
    const org = rootGetters["auth/activeOrganization"];
    const organizationId = org.organizationId;
    await this.$axios.patch(`/organizations/${organizationId}`, context);
    return dispatch("getOrganization", organizationId);
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
  async getMembers({ rootGetters, commit }) {
    const org = rootGetters["auth/activeOrganization"];
    const organizationId = org.organizationId;
    const members = (await this.$axios.get(
      `/organizations/${organizationId}/memberships`
    )).data;
    commit("setMembers", members);
  },
  async inviteMember({ dispatch, rootGetters }, context) {
    const org = rootGetters["auth/activeOrganization"];
    const organizationId = org.organizationId;
    await this.$axios.put(
      `/organizations/${organizationId}/memberships`,
      context
    );
    return dispatch("getMembers");
  },
  async deleteMembership({ dispatch }, context) {
    await this.$axios.delete(`/memberships/${context}`);
    return dispatch("getMembers");
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
  async getBilling({ commit }, context) {
    const billing: any = (await this.$axios.get(
      `/organizations/${context}/billing`
    )).data;
    commit("setBilling", billing);
  },
  async updateBilling({ dispatch }, context) {
    const data = JSON.parse(JSON.stringify(context));
    delete data.id;
    await this.$axios.patch(`/organizations/${context.id}/billing`, data);
    return dispatch("getBilling", context.id);
  },
  async getInvoices({ commit }, context) {
    const invoices: any = (await this.$axios.get(
      `/organizations/${context}/invoices`
    )).data;
    commit("setInvoices", invoices);
  },
  async getSubscriptions({ commit }, context) {
    const subscriptions: any = (await this.$axios.get(
      `/organizations/${context}/subscriptions`
    )).data;
    commit("setSubscriptions", subscriptions);
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
  billing: state => state.billing,
  invoices: state => state.invoices,
  subscriptions: state => state.subscriptions,
  pricingPlans: state => state.pricingPlans,
  securityEvents: state => state.recentEvents,
  sources: state => state.sources,
  members: state => state.members
};
