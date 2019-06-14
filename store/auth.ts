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
  setAuthentication(state: RootState, tokens: Tokens): void {
    Vue.set(state, "tokens", tokens);
    Vue.set(state, "user", decode(tokens.token));
    state.loading = false;
    state.isAuthenticated = true;
  },
  removeAuthentication(state: RootState): void {
    Vue.set(state, "tokens", { token: "", refresh: "" });
    state.loading = false;
    state.isAuthenticated = false;
    state.notifications = [];
    delete state.user;
  },
  startLoading(state: RootState): void {
    state.loading = true;
  },
  stopLoading(state: RootState): void {
    state.loading = false;
  },
  setNotifications(state: RootState, notifications: any): void {
    Vue.set(state, "notifications", notifications);
  },
  set2FA(state: RootState, twoFactorToken: string): void {
    Vue.set(state, "tokens", { twoFactorToken });
    state.loading = false;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async loginWithEmailPassword({ commit }, context) {
    commit("startLoading");
    try {
      const tokens = (await this.$axios.post("/auth/login", context)).data;
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
    } catch (error) {
      commit("stopLoading");
      throw new Error(error);
    }
  },
  async loginWithGoogle({ commit }, context) {
    commit("startLoading");
    try {
      const tokens = (await this.$axios.post("/auth/google/verify", context))
        .data;
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
  isAuthenticated: state => state.isAuthenticated
};
