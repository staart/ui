import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, Organization, emptyMembers } from "~/types/manage";
import download from "downloadjs";
import Vue from "vue";

const stripeProductId = "prod_CtJZklN9W4QmxA";
export const state = (): RootState => ({
  memberships: {},
  isDownloading: false,
  organizations: {}
});

export const mutations: MutationTree<RootState> = {
  setOrganization(state: RootState, organization: Organization): void {
    const organizations = state.organizations;
    organizations[organization.id] = organization;
    Vue.set(state, "organizations", organizations);
  },
  setMembers(state: RootState, { team, members, start }): void {
    const currentMembers = state.memberships;
    currentMembers[team] = currentMembers[team] || emptyMembers;
    currentMembers[team].data = [...currentMembers[team].data, ...members.data];
    currentMembers[team].next = start;
    Vue.set(state, "memberships", currentMembers);
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
    delete state.organizations;
    delete state.billing;
    delete state.invoices;
    delete state.memberships;
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
    commit("setMembers", { team, members, start });
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
  isDownloading: state => state.isDownloading,
  sources: state => state.sources,
  memberships: state => (orgId: string) => state.memberships[parseInt(orgId)],
  organization: state => (orgId: string) => state.organizations[parseInt(orgId)]
};
