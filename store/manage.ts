import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, Organization, Member } from "~/types/manage";
import Vue from "vue";

const stripeProductId = "prod_CtJZklN9W4QmxA";
export const state = (): RootState => ({
  members: []
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
  clearAll(state: RootState): void {
    delete state.organization;
    delete state.billing;
    delete state.invoices;
    delete state.members;
    delete state.membership;
    delete state.subscriptions;
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
  async updateOrganization({ dispatch, state }, context) {
    if (!state.organization) return;
    await this.$axios.patch(`/organizations/${state.organization.id}`, context);
    return dispatch("getOrganization", state.organization.id);
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
  async deleteSource(actions, context) {
    return (await this.$axios.delete(
      `/organizations/${context.id}/sources/${context.sourceId}`
    )).data;
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
  }
};

export const getters: GetterTree<RootState, RootState> = {
  membership: state => state.membership,
  billing: state => state.billing,
  invoices: state => state.invoices,
  subscriptions: state => state.subscriptions,
  pricingPlans: state => state.pricingPlans,
  sources: state => state.sources,
  members: state => state.members
};
