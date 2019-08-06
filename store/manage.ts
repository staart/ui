import { MutationTree, ActionTree, GetterTree } from "vuex";
import download from "downloadjs";
import Vue from "vue";
import { RootState, Organization, emptyPagination } from "~/types/manage";

export const state = (): RootState => ({
  memberships: {},
  isDownloading: false,
  organizations: {},
  billing: {},
  loggedInMembership: {},
  subscriptions: {},
  subscription: {},
  invoices: {},
  invoice: {},
  sources: {},
  source: {},
  apiKeys: {},
  apiKey: {},
  domains: {},
  domain: {},
  devWebhooks: {},
  devWebhook: {},
  apiKeyLogs: {}
});

export const mutations: MutationTree<RootState> = {
  setOrganization(state: RootState, organization: Organization): void {
    const organizations = state.organizations;
    organizations[organization.id] = organization;
    Vue.set(state, "organizations", organizations);
  },
  setLoggedInMembership(state: RootState, { team, role }) {
    const loggedInMembership = state.loggedInMembership;
    loggedInMembership[team] = role;
    Vue.set(state, "loggedInMembership", loggedInMembership);
  },
  setMembers(state: RootState, { team, members, start, next }): void {
    const currentMembers = { ...state.memberships };
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
    const currentBilling = { ...state.billing };
    currentBilling[team] = billing;
    Vue.set(state, "billing", currentBilling);
  },
  setSubscriptions(
    state: RootState,
    { team, subscriptions, start, next }
  ): void {
    const currentSubscriptions = { ...state.subscriptions };
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
    const currentSubscriptions = { ...state.subscription };
    currentSubscriptions[team] = currentSubscriptions[team] || {};
    currentSubscriptions[team][id] = { ...subscription };
    Vue.set(state, "subscription", currentSubscriptions);
  },
  setInvoices(state: RootState, { team, invoices, start, next }): void {
    const currentInvoices = { ...state.invoices };
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
    const currentInvoices = { ...state.invoice };
    currentInvoices[team] = currentInvoices[team] || {};
    currentInvoices[team][id] = { ...invoice };
    Vue.set(state, "invoice", currentInvoices);
  },
  setSources(state: RootState, { team, sources, start, next }): void {
    const currentSources = { ...state.sources };
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
    const currentSources = { ...state.source };
    currentSources[team] = currentSources[team] || {};
    currentSources[team][id] = { ...source };
    Vue.set(state, "source", currentSources);
  },
  setApiKeys(state: RootState, { team, apiKeys, start, next }): void {
    const currentApiKeys = { ...state.apiKeys };
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
    const currentApiKeys = { ...state.apiKey };
    currentApiKeys[team] = currentApiKeys[team] || {};
    currentApiKeys[team][id] = { ...apiKey };
    Vue.set(state, "apiKey", currentApiKeys);
  },
  setApiKeyLogs(state: RootState, { team, apiKeyLogs, id, from }): void {
    const currentApiKeyLogs = { ...state.apiKeyLogs };
    currentApiKeyLogs[team] = currentApiKeyLogs[team] || {};
    currentApiKeyLogs[team][id] = currentApiKeyLogs[team][id] || emptyPagination;
    if (from) {
      currentApiKeyLogs[team][id].data = [
        ...currentApiKeyLogs[team][id].data,
        ...apiKeyLogs.data
      ];
    } else {
      currentApiKeyLogs[team][id] = { ...apiKeyLogs };
    }
    Vue.set(state, "apiKeyLogs", currentApiKeyLogs);
  },
  setDomains(state: RootState, { team, domains, start, next }): void {
    const currentDomains = { ...state.domains };
    currentDomains[team] = currentDomains[team] || emptyPagination;
    if (start) {
      currentDomains[team].data = [
        ...currentDomains[team].data,
        ...domains.data
      ];
    } else {
      currentDomains[team].data = domains.data;
    }
    currentDomains[team].next = next;
    Vue.set(state, "domains", currentDomains);
  },
  setDomain(state: RootState, { team, domain, id }): void {
    const currentDomains = { ...state.domain };
    currentDomains[team] = currentDomains[team] || {};
    currentDomains[team][id] = { ...domain };
    Vue.set(state, "domain", currentDomains);
  },
  setWebhooks(state: RootState, { team, webhooks, start, next }): void {
    const currentWebhooks = { ...state.devWebhooks };
    currentWebhooks[team] = currentWebhooks[team] || emptyPagination;
    if (start) {
      currentWebhooks[team].data = [
        ...currentWebhooks[team].data,
        ...webhooks.data
      ];
    } else {
      currentWebhooks[team].data = webhooks.data;
    }
    currentWebhooks[team].next = next;
    Vue.set(state, "devWebhooks", currentWebhooks);
  },
  setWebhook(state: RootState, { team, webhook, id }): void {
    const currentWebhooks = { ...state.devWebhook };
    currentWebhooks[team] = currentWebhooks[team] || {};
    currentWebhooks[team][id] = { ...webhook };
    Vue.set(state, "devWebhook", currentWebhooks);
  },
  setPricingPlans(state: RootState, pricingPlans: any): void {
    Vue.set(state, "pricingPlans", pricingPlans);
  },
  setRecentEvents(state: RootState, recentEvents: any): void {
    Vue.set(state, "recentEvents", recentEvents);
  },
  clearAll(state: RootState): void {
    const currentState = { ...state };
    currentState.organizations = {};
    currentState.billing = {};
    currentState.memberships = {};
    delete currentState.membership;
    currentState.subscriptions = {};
    currentState.subscription = {};
    currentState.invoices = {};
    currentState.invoice = {};
    currentState.sources = {};
    currentState.source = {};
    currentState.recentEvents = {};
    currentState.pricingPlans = {};
    currentState.apiKeys = {};
    currentState.apiKey = {};
    currentState.domains = {};
    currentState.domain = {};
    currentState.devWebhooks = {};
    currentState.devWebhook = {};
    state = currentState;
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
    return dispatch("getOrganization", context.username || context.team);
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
    await this.$axios.delete(`/organizations/${team}/memberships/${id}`);
    return dispatch("getMembers", { team });
  },
  async getMembership(actions, { id, team }) {
    return (await this.$axios.get(`/organizations/${team}/memberships/${id}`)).data;
  },
  async updateMembership({ dispatch }, context) {
    const data = { ...context };
    delete data.id;
    delete data.team;
    await this.$axios.patch(`/organizations/${context.team}/memberships/${context.id}`, data);
    return dispatch("getMembership", { team: context.team, id: context.id });
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
      `/organizations/${context}/pricing`
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
  async getApiKeyLogs({ commit }, { team, id, range, from }) {
    const apiKeyLogs: any = (await this.$axios.get(
      `/organizations/${team}/api-keys/${id}/logs?range=${range}&from=${from}`
    )).data;
    commit("setApiKeyLogs", { team, apiKeyLogs, range, id, from });
    return apiKeyLogs;
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
  async getDomains({ commit }, { team, start = 0 }) {
    const domains: any = (await this.$axios.get(
      `/organizations/${team}/domains?start=${start}`
    )).data;
    commit("setDomains", { team, domains, start, next: domains.next });
    return domains;
  },
  async getDomain({ commit }, { team, id }) {
    const domain: any = (await this.$axios.get(
      `/organizations/${team}/domains/${id}`
    )).data;
    commit("setDomain", { team, domain, id });
    return domain;
  },
  async createDomain({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/organizations/${context.team}/domains`, data);
    return dispatch("getDomains", { team: context.team });
  },
  async deleteDomain({ dispatch }, context) {
    await this.$axios.delete(
      `/organizations/${context.team}/domains/${context.id}`
    );
    return dispatch("getDomains", { team: context.team });
  },
  async updateDomain({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/organizations/${context.team}/domains/${context.id}`,
      data
    );
    return dispatch("getDomain", context);
  },
  async verifyDomain({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.post(
      `/organizations/${context.team}/domains/${context.id}/verify`,
      data
    );
    return dispatch("getDomain", context);
  },
  async getWebhooks({ commit }, { team, start = 0 }) {
    const webhooks: any = (await this.$axios.get(
      `/organizations/${team}/webhooks?start=${start}`
    )).data;
    commit("setWebhooks", { team, webhooks, start, next: webhooks.next });
    return webhooks;
  },
  async getWebhook({ commit }, { team, id }) {
    const webhook: any = (await this.$axios.get(
      `/organizations/${team}/webhooks/${id}`
    )).data;
    commit("setWebhook", { team, webhook, id });
    return webhook;
  },
  async createWebhook({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    await this.$axios.put(`/organizations/${context.team}/webhooks`, data);
    return dispatch("getWebhooks", { team: context.team });
  },
  async deleteWebhook({ dispatch }, context) {
    await this.$axios.delete(
      `/organizations/${context.team}/webhooks/${context.id}`
    );
    return dispatch("getWebhooks", { team: context.team });
  },
  async updateWebhook({ dispatch }, context) {
    const data = { ...context };
    delete data.team;
    delete data.id;
    await this.$axios.patch(
      `/organizations/${context.team}/webhooks/${context.id}`,
      data
    );
    return dispatch("getWebhook", context);
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
  memberships: state => (team: string) => (state.memberships)[team],
  loggedInMembership: state => (team: string) => (state.loggedInMembership)[team] || 4,
  billing: state => (team: string) => (state.billing)[team],
  subscriptions: state => (team: string) => (state.subscriptions)[team],
  subscription: state => (team: string, subscriptionId: string) =>
    state.subscription[team] && state.subscription[team][subscriptionId],
  invoices: state => (team: string) => (state.invoices)[team],
  invoice: state => (team: string, invoiceId: string) =>
    state.invoice[team] && state.invoice[team][invoiceId],
  sources: state => (team: string) => (state.sources)[team],
  source: state => (team: string, sourceId: string) =>
    state.source[team] && state.source[team][sourceId],
  apiKeys: state => (team: string) => (state.apiKeys)[team],
  apiKey: state => (team: string, apiKey: string) =>
    state.apiKey[team] && state.apiKey[team][apiKey],
  domains: state => (team: string) => (state.domains)[team],
  domain: state => (team: string, domain: string) =>
    state.domain[team] && state.domain[team][domain],
  webhooks: state => (team: string) => (state.devWebhooks)[team],
  webhook: state => (team: string, webhook: string) =>
    state.devWebhook[team] && state.devWebhook[team][webhook],
  apiKeyLogs: state => (team: string, apiKeyLogs: string) =>
    state.apiKeyLogs[team] && state.apiKeyLogs[team][apiKeyLogs],
  organization: state => (team: string) => (state.organizations)[team]
};
