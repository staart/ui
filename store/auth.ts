import { MutationTree, ActionTree, GetterTree } from "vuex";
import decode from "jwt-decode";
import { Vue } from "vue-property-decorator";
import { RootState, Tokens } from "../types/auth";

export const state = (): RootState => ({
  isAuthenticated: false,
  loading: false,
  tokens: {
    token: "",
    refresh: ""
  }
});

export const mutations: MutationTree<RootState> = {
  setAuthentication(state: RootState, tokens: Tokens): void {
    state.tokens = tokens;
    state.loading = false;
    state.isAuthenticated = true;
    state.user = decode(tokens.token);
  },
  removeAuthentication(state: RootState): void {
    Vue.set(state, "tokens", { token: "", refresh: "" });
    state.loading = false;
    state.isAuthenticated = false;
    delete state.activeOrganization;
    delete state.user;
  },
  startLoading(state: RootState): void {
    state.loading = true;
  },
  stopLoading(state: RootState): void {
    state.loading = false;
  },
  setOrganization(state: RootState, organization: any): void {
    Vue.set(state, "activeOrganization", organization);
  },
  setOrganizationDetails(state: RootState, organization: any): void {
    Vue.set(state.activeOrganization, "organization", organization);
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async loginWithEmailPassword({ commit }, context) {
    commit("startLoading");
    try {
      const tokens: Tokens = (await this.$axios.post("/auth/login", context))
        .data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async register({ commit }, context) {
    return (await this.$axios.put("/users", context)).data;
  },
  async refresh({ state, commit }) {
    commit("startLoading");
    try {
      const tokens: Tokens = (await this.$axios.post("/auth/refresh", {
        token: state.tokens.refresh
      })).data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async loginWithGoogle({ commit }, context) {
    commit("startLoading");
    try {
      const tokens: Tokens = (await this.$axios.post(
        "/auth/google/verify",
        context
      )).data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async sendPasswordResetLink({ commit }, context) {
    await this.$axios.post("/auth/reset-password/request", context);
  },
  async resetPassword({ commit }, context) {
    const response = (await this.$axios.post(
      "/auth/reset-password/recover",
      context
    )).data;
  },
  logout({ commit }) {
    commit("removeAuthentication");
    commit("settings/clearAll", undefined, { root: true });
    commit("manage/clearAll", undefined, { root: true });
  },
  async setOrganization({ commit }, organizationId) {
    const memberships = (await this.$axios.get("/users/me/memberships")).data;
    if (!memberships.length) throw new Error();
    commit("manage/clearAll", undefined, { root: true });
    const set = memberships.filter(
      membership =>
        parseInt(membership.organizationId) === parseInt(organizationId)
    );
    if (set.length) {
      commit("setOrganization", set[0]);
    } else {
      commit("setOrganization", memberships[0]);
    }
  },
  async resetOrganization({ commit, state }) {
    const org = state.activeOrganization.organization.id;
    const organization = (await this.$axios.get(`/organizations/${org}`)).data;
    commit("setOrganizationDetails", organization);
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user,
  isLoading: state => state.loading,
  activeOrganization: state => state.activeOrganization,
  isAuthenticated: state => state.isAuthenticated
};
