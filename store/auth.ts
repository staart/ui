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
  },
  notifications: []
});

export const mutations: MutationTree<RootState> = {
  setAuthentication(state: RootState, tokens: Tokens) {
    const currentTokens = state.tokens;
    Vue.set(state, "tokens", { ...currentTokens, ...tokens });
    Vue.set(state, "user", decode(tokens.token));
    state.loading = false;
    state.isAuthenticated = true;
  },
  removeAuthentication(state: RootState) {
    Vue.set(state, "tokens", { token: "", refresh: "" });
    state.loading = false;
    state.isAuthenticated = false;
    state.notifications = [];
    delete state.activeOrganization;
    delete state.user;
  },
  startLoading(state: RootState) {
    state.loading = true;
  },
  stopLoading(state: RootState) {
    state.loading = false;
  },
  setNotifications(state: RootState, notifications: any) {
    Vue.set(state, "notifications", notifications);
  },
  set2FA(state: RootState, twoFactorToken: string) {
    Vue.set(state, "tokens", { twoFactorToken });
    state.loading = false;
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
  async loginWithEmailPassword({ commit, dispatch }, context) {
    commit("startLoading");
    try {
      const tokens = (await this.$axios.post("/auth/login", context)).data;
      dispatch("loginWithTokens", tokens);
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async loginWith2FA({ commit }, context) {
    commit("startLoading");
    try {
      const tokens: Tokens = (await this.$axios.post("/auth/2fa", context))
        .data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async register({ commit }, context) {
    return (await this.$axios.post("/auth/register", context)).data;
  },
  async refresh({ state, commit }) {
    commit("startLoading");
    try {
      const tokens: Tokens = (await this.$axios.post("/auth/refresh", {
        token: state.tokens.refresh
      })).data;
      this.$axios.setToken(tokens.token, "Bearer");
      commit("setAuthentication", tokens);
      return tokens.token;
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async oauthLogin({ commit }, { service, code }) {
    commit("startLoading");
    try {
      const tokens = (await this.$axios.post(`/auth/oauth/${service}`, {
        code
      })).data;
      if (tokens.twoFactorToken) {
        commit("set2FA", tokens.twoFactorToken);
        return "2fa";
      } else {
        this.$axios.setToken(tokens.token, "Bearer");
        commit("setAuthentication", tokens);
      }
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
    if (process.client) {
      document.documentElement.classList.remove("prefers-reduced-motion");
      document.documentElement.classList.remove("prefers-color-scheme-dark");
    }
  },
  async getNotifications({ commit, state }) {
    const notifications = (await this.$axios.get(`/users/me/notifications`))
      .data;
    commit("setNotifications", notifications);
  },
  async readNotification({ dispatch }, notificationId) {
    await this.$axios.patch(`/users/me/notifications/${notificationId}`, {
      isRead: true
    });
    return dispatch("getNotifications");
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user,
  isLoading: state => state.loading,
  notifications: state => state.notifications,
  activeOrganization: state => state.activeOrganization,
  isAuthenticated: state => state.isAuthenticated
};
