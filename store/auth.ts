import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import decode from "jwt-decode";

interface RootState {
  tokens: Tokens;
  isAuthenticated: boolean;
  username?: string;
}
export interface Tokens {
  token: string;
  refresh: string;
}

export const state = (): RootState => ({
  isAuthenticated: false,
  tokens: {
    token: "",
    refresh: ""
  }
});

export const mutations: MutationTree<RootState> = {
  setAuthentication(state: RootState, tokens: Tokens) {
    const currentTokens = state.tokens;
    Vue.set(state, "tokens", { ...currentTokens, ...tokens });
    Vue.set(
      state,
      "username",
      decode<{ username: string }>(tokens.token).username
    );
    state.isAuthenticated = true;
  },
  removeAuthentication(state: RootState) {
    Vue.set(state, "tokens", { token: "", refresh: "" });
    state.isAuthenticated = false;
  },
  set2FA(state: RootState, twoFactorToken: string) {
    Vue.set(state, "tokens", { twoFactorToken });
  },
  setActiveOrganization(state: RootState, team: string) {
    Vue.set(state, "activeOrganization", team);
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
  loginWithTokens({ commit }, tokens) {
    if (tokens.twoFactorToken) {
      commit("set2FA", tokens.twoFactorToken);
      return "2fa";
    } else {
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
    }
  },
  async safeRefresh({ state, dispatch }) {
    const token = state.tokens.token;
    if (!token) return;
    console.log(
      "Safe refresh: Token expires at",
      new Date(decode<{ exp: number }>(token).exp * 1000)
    );
    if (decode<{ exp: number }>(token).exp * 1000 < new Date().getTime()) {
      console.log("Safe refreshing...");
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
    commit("startLoading");
    try {
      const tokens: Tokens = (
        await this.$axios.post("/auth/refresh", {
          token: refreshToken
        })
      ).data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
      commit("stopLoading");
      return tokens.token;
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  logout({ commit }) {
    commit("removeAuthentication");
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
  username: state => state.username
};
