import { MutationTree, ActionTree, GetterTree } from "vuex";
import decode from "jwt-decode";
import { RootState, Tokens } from "../types/auth";

export const state = (): RootState => ({
  isAuthenticated: false,
  tokens: {
    token: "",
    refresh: ""
  }
});

export const mutations: MutationTree<RootState> = {
  setAuthentication(state: RootState, tokens: Tokens): void {
    state.tokens = tokens;
    state.isAuthenticated = true;
    state.user = decode(tokens.token);
  },
  removeAuthentication(state: RootState): void {
    state.tokens = { token: "", refresh: "" };
    state.isAuthenticated = false;
    delete state.user;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async loginWithEmailPassword({ commit }, context) {
    const tokens: Tokens = (await this.$axios.post("/auth/login", context))
      .data;
    this.$axios.setToken(tokens.token, "Bearer");
    commit("setAuthentication", tokens);
  },
  async sendPasswordResetLink({ commit }, context) {
    await this.$axios.post("/auth/reset-password/request", context);
  },
  async resetPassword({ commit }, context) {
    const response = (await this.$axios.post(
      "/auth/reset-password/recover",
      context
    )).data;
    console.log(response);
  },
  logout({ commit }) {
    commit("removeAuthentication");
    commit("settings/clearAll", undefined, { root: true });
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user,
  isAuthenticated: state => state.isAuthenticated
};
