import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import decode from "jwt-decode";

interface RootState {
  tokens: Tokens;
  isAuthenticated: boolean;
  user: User;
}
export interface Tokens {
  token: string;
  refresh: string;
}
export interface User {
  details?: any;
  memberships?: any;
}

export const state = (): RootState => ({
  isAuthenticated: false,
  tokens: {
    token: "",
    refresh: ""
  },
  user: {
    details: {},
    memberships: {}
  }
});

export const mutations: MutationTree<RootState> = {
  setAuthentication(state: RootState, tokens: Tokens) {
    const currentTokens = state.tokens;
    Vue.set(state, "tokens", { ...currentTokens, ...tokens });
    state.isAuthenticated = true;
  },
  removeAuthentication(state: RootState) {
    Vue.set(state, "tokens", { token: "", refresh: "" });
    Vue.set(state, "user", { details: {}, memberships: {} });
    state.isAuthenticated = false;
  },
  set2FA(state: RootState, twoFactorToken: string) {
    Vue.set(state, "tokens", { twoFactorToken });
  },
  setActiveOrganization(state: RootState, team: string) {
    Vue.set(state, "activeOrganization", team);
  },
  setUserDetails(
    state: RootState,
    { details, memberships }: { details?: any; memberships?: any }
  ) {
    if (details) Vue.set(state.user, "details", details);
    if (memberships) Vue.set(state.user, "memberships", memberships);
  }
};

export const actions: ActionTree<RootState, RootState> = {
  setAuthTokens({ commit }, tokens: any) {
    if (tokens.twoFactorToken) {
      commit("set2FA", tokens.twoFactorToken);
      return "2fa";
    } else {
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
    }
  },
  async loginWithTokens({ commit }, tokens) {
    if (tokens.twoFactorToken) {
      commit("set2FA", tokens.twoFactorToken);
      return "2fa";
    } else {
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
      const details = (await this.$axios.get("/users/me")).data;
      const memberships = (await this.$axios.get("/users/me/memberships")).data;
      commit("setUserDetails", { details, memberships });
    }
  },
  async safeRefresh({ state, dispatch }) {
    const token = state.tokens.token;
    if (!token) return;
    if (decode<{ exp: number }>(token).exp * 1000 < new Date().getTime()) {
      return dispatch("refresh");
    }
  },
  async refresh({ state, dispatch, commit }) {
    const refreshToken = state.tokens.refresh;
    if (!refreshToken) throw new Error();
    if (
      decode<{ exp: number }>(refreshToken).exp * 1000 <
      new Date().getTime()
    ) {
      dispatch("logout");
      window.location.href = "/";
      return;
    }
    try {
      const tokens: Tokens = (
        await this.$axios.post("/auth/refresh", {
          token: refreshToken
        })
      ).data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
      return tokens.token;
    } catch (error) {
      throw new Error(error);
    }
  },
  logout({ commit }) {
    commit("removeAuthentication");
    this.$axios
      .post("/auth/logout")
      .then(() => {})
      .catch(() => {});
    // commit("manage/clearAll", undefined, { root: true });
    // commit("users/clearAll", undefined, { root: true });
    if (process.client) {
      document.documentElement.classList.remove("prefers-reduced-motion");
      document.documentElement.classList.remove("prefers-color-scheme-dark");
    }
  }
};

export const getters: GetterTree<RootState, RootState> = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
};
