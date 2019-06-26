import { MutationTree, ActionTree, GetterTree } from "vuex";
import download from "downloadjs";
import Vue from "vue";
import { RootState, Organization, emptyPagination } from "~/types/manage";

const stripeProductId = "prod_FGFAYQGEFTm2lu";
export const state = (): RootState => ({
  memberships: {},
  isDownloading: false,
  organizations: {},
  billing: {},
  subscriptions: {},
  subscription: {},
  invoices: {},
  invoice: {},
  sources: {},
  source: {},
  apiKeys: {},
  apiKey: {}
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
      currentMembers[team].data = [
        ...currentMembers[team].data,
        ...members.data
      ];
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
  setSubscriptions(
    state: RootState,
    { team, subscriptions, start, next }
  ): void {
    const currentSubscriptions = state.subscriptions;
    currentSubscriptions[team] = currentSubscriptions[team] || emptyPagination;
    if (start) {
      currentSubscriptions[team].data = [
        ...currentSubscriptions[team].data,
        ...subscriptions.data
      ];
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
      currentInvoices[team].data = [
        ...currentInvoices[team].data,
        ...invoices.data
      ];
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
  setSources(state: RootState, { team, sources, start, next }): void {
    const currentSources = state.sources;
    currentSources[team] = currentSources[team] || emptyPagination;
    if (start) {
      currentSources[team].data = [
        ...currentSources[team].data,
        ...sources.data
      ];
    } else {
      currentSources[team].data = sources.data;
    }
    currentSources[team].next = next;
    Vue.set(state, "sources", currentSources);
  },
  setSource(state: RootState, { team, source, id }): void {
    const currentSources = state.source;
    currentSources[team] = currentSources[team] || {};
    currentSources[team][id] = { ...source };
    Vue.set(state, "source", currentSources);
  },
  setApiKeys(state: RootState, { team, apiKeys, start, next }): void {
    const currentApiKeys = state.apiKeys;
    currentApiKeys[team] = currentApiKeys[team] || emptyPagination;
    if (start) {
      currentApiKeys[team].data = [
        ...currentApiKeys[team].data,
        ...apiKeys.data
      ];
    } else {
      currentApiKeys[team].data = apiKeys.data;
    }
    currentApiKeys[team].next = next;
    Vue.set(state, "apiKeys", currentApiKeys);
  },
  setApiKey(state: RootState, { team, apiKey, id }): void {
    const currentApiKeys = state.apiKey;
    currentApiKeys[team] = currentApiKeys[team] || {};
    currentApiKeys[team][id] = { ...apiKey };
    Vue.set(state, "apiKey", currentApiKeys);
  },
  setPricingPlans(state: RootState, pricingPlans: any): void {
    Vue.set(state, "pricingPlans", pricingPlans);
  },
  setRecentEvents(state: RootState, recentEvents: any): void {
    Vue.set(state, "recentEvents", recentEvents);
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
    delete state.sources;
    delete state.source;
    delete state.recentEvents;
    delete state.pricingPlans;
    delete state.apiKeys;
    delete state.apiKey;
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
  async deleteOrganization({ commit, rootGetters }, { team }) {
    await this.$axios.delete(`/organizations/${team}`);
    commit("clearAll");
  },
  async getExport({ commit, rootGetters }, { team }) {
    const data = (await this.$axios.get(`/organizations/${team}/data`)).data;
    download(
      JSON.stringify(data, null, 2),
      `export-${new Date().getTime()}.json`,
      "application/json"
    );
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
    const data = { ...context };
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
    const data = { ...context };
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
    commit("setSubscriptions", {
      team,
      subscriptions,
      start,
      next: subscriptions.next
    });
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
    await this.$axios.put(`/organizations/${team}/subscriptions`, { plan });
    return dispatch("getSubscriptions", { team });
  },
  async getPricingPlans({ commit }, context) {
    const subscriptions: any = (await this.$axios.get(
      `/organizations/${context}/pricing/${stripeProductId}`
    )).data;
    commit("setPricingPlans", subscriptions);
  },
  async getSources({ commit }, { team, start = 0 }) {
    const sources: any = (await this.$axios.get(
      `/organizations/${team}/sources?start=${start}`
    )).data;
    commit("setSources", { team, sources, start, next: sources.next });
    return sources;
  },
  async getSource({ commit }, { team, id }) {
    const source: any = (await this.$axios.get(
      `/organizations/${team}/sources/${id}`
    )).data;
    commit("setSource", { team, source, id });
    return source;
  },
  async createSource({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/organizations/${context.team}/sources`, data);
    return dispatch("getSources", { team: context.team });
  },
  async deleteSource({ dispatch }, context) {
    await this.$axios.delete(
      `/organizations/${context.team}/sources/${context.id}`
    );
    return dispatch("getSources", { team: context.team });
  },
  async updateSource({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/organizations/${context.team}/sources/${context.id}`,
      data
    );
    return dispatch("getSource", { team: context.team, id: context.id });
  },
  async getApiKeys({ commit }, { team, start = 0 }) {
    const apiKeys: any = (await this.$axios.get(
      `/organizations/${team}/api-keys?start=${start}`
    )).data;
    commit("setApiKeys", { team, apiKeys, start, next: apiKeys.next });
    return apiKeys;
  },
  async getApiKey({ commit }, { team, id }) {
    const apiKey: any = (await this.$axios.get(
      `/organizations/${team}/api-keys/${id}`
    )).data;
    commit("setApiKey", { team, apiKey, id });
    return apiKey;
  },
  async createApiKey({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/organizations/${context.team}/api-keys`, data);
    return dispatch("getApiKeys", { team: context.team });
  },
  async deleteApiKey({ dispatch }, context) {
    await this.$axios.delete(
      `/organizations/${context.team}/api-keys/${context.id}`
    );
    return dispatch("getApiKeys", { team: context.team });
  },
  async updateApiKey({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/organizations/${context.team}/api-keys/${context.id}`,
      data
    );
    return dispatch("getApiKey", context);
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
  memberships: state => (team: string) => state.memberships[team],
  billing: state => (team: string) => state.billing[team],
  subscriptions: state => (team: string) => state.subscriptions[team],
  subscription: state => (team: string, subscriptionId: string) =>
    state.subscription[team] && state.subscription[team][subscriptionId],
  invoices: state => (team: string) => state.invoices[team],
  invoice: state => (team: string, invoiceId: string) =>
    state.invoice[team] && state.invoice[team][invoiceId],
  sources: state => (team: string) => state.sources[team],
  source: state => (team: string, sourceId: string) =>
    state.source[team] && state.source[team][sourceId],
  apiKeys: state => (team: string) => state.apiKeys[team],
  apiKey: state => (team: string, apiKey: string) =>
    state.apiKey[team] && state.apiKey[team][apiKey],
  organization: state => (team: string) => state.organizations[team]
};
