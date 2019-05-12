import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, Organization, Member } from "~/types/manage";
import Vue from "vue";

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
  clearAll(state: RootState): void {
    delete state.organization;
    delete state.billing;
    delete state.members;
    delete state.membership;
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
    const members = (await this.$axios.get(
      `/organizations/${rootGetters["auth/activeOrganization"].id}/memberships`
    )).data;
    commit("setMembers", members);
  },
  async inviteMember({ dispatch, rootGetters }, context) {
    await this.$axios.put(
      `/organizations/${rootGetters["auth/activeOrganization"].id}/memberships`,
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
  }
};

export const getters: GetterTree<RootState, RootState> = {
  membership: state => state.membership,
  billing: state => state.billing,
  members: state => state.members
};
