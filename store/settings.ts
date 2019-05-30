import { MutationTree, ActionTree, GetterTree } from "vuex";
import download from "downloadjs";
import Vue from "vue";
import {
  RootState,
  User,
  Email,
  SecurityEvent,
  Membership,
  BackupCode
} from "../types/settings";

export const state = (): RootState => ({
  emails: [],
  memberships: [],
  securityEvents: [],
  isDownloading: false,
  backupCodes: [],
  apiKeys: []
});

export const mutations: MutationTree<RootState> = {
  setUser(state: RootState, user: User): void {
    Vue.set(state, "user", user);
    try {
      if (document) {
        if (user.prefersReducedMotion) {
          document.body.classList.add("prefers-reduced-motion");
        } else {
          document.body.classList.remove("prefers-reduced-motion");
        }
        if (user.prefersColorSchemeDark) {
          document.body.classList.add("prefers-color-scheme-dark");
        } else {
          document.body.classList.remove("prefers-color-scheme-dark");
        }
      }
    } catch (error) {}
  },
  setEmails(state: RootState, emails: Email[]): void {
    Vue.set(state, "emails", emails);
  },
  setMemberships(state: RootState, memberships: Membership[]): void {
    Vue.set(state, "memberships", memberships);
  },
  setSecurityEvents(state: RootState, securityEvents: SecurityEvent[]): void {
    Vue.set(state, "securityEvents", securityEvents);
  },
  setBackupCodes(state: RootState, backupCodes: BackupCode[]): void {
    Vue.set(state, "backupCodes", backupCodes);
  },
  setApiKeys(state: RootState, apiKeys: any): void {
    Vue.set(state, "apiKeys", apiKeys);
  },
  clearAll(state: RootState): void {
    delete state.user;
    delete state.emails;
    delete state.memberships;
    delete state.apiKeys;
    delete state.securityEvents;
  },
  startDownloading(state: RootState): void {
    state.isDownloading = true;
  },
  stopDownloading(state: RootState): void {
    state.isDownloading = false;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async getUser({ commit }, context) {
    const user: User = (await this.$axios.get("/users/me")).data;
    commit("setUser", user);
  },
  async updateUser({ dispatch }, context) {
    await this.$axios.patch("/users/me", context);
    return dispatch("getUser");
  },
  async getEmails({ commit }, context) {
    const emails: Email[] = (await this.$axios.get("/users/me/emails")).data;
    commit("setEmails", emails);
  },
  async addEmail({ dispatch }, context) {
    await this.$axios.put("/users/me/emails", context);
    return dispatch("getEmails");
  },
  async deleteEmail({ dispatch }, context) {
    await this.$axios.delete(`/users/me/emails/${context}`);
    return dispatch("getEmails");
  },
  async makeEmailPrimary({ dispatch }, context) {
    await this.$axios.patch("/users/me", { primaryEmail: context });
    return dispatch("getEmails");
  },
  async getEvents({ commit }, context) {
    const securityEvents: SecurityEvent[] = (await this.$axios.get(
      "/users/me/events"
    )).data;
    commit("setSecurityEvents", securityEvents);
  },
  async getBackupCodes({ commit }, context) {
    const backupCodes: BackupCode[] = (await this.$axios.get(
      "/users/me/backup-codes"
    )).data;
    commit("setBackupCodes", backupCodes);
  },
  async getExport({ commit }, context) {
    commit("startDownloading");
    const data = (await this.$axios.get("/users/me/data")).data;
    download(
      JSON.stringify(data, null, 2),
      `export-${new Date().getTime()}.json`,
      "application/json"
    );
    commit("stopDownloading");
  },
  async deleteAccount({ commit }, context) {
    await this.$axios.delete("/users/me");
  },
  async getMemberships({ commit }, context) {
    const memberships: Membership[] = (await this.$axios.get(
      "/users/me/memberships"
    )).data;
    commit("setMemberships", memberships);
  },
  async deleteMembership({ dispatch }, context) {
    await this.$axios.delete(`/memberships/${context}`);
    return dispatch("getMemberships");
  },
  async createOrganization({ dispatch }, context) {
    await this.$axios.put("/organizations", context);
    return dispatch("getMemberships");
  },
  async getApiKeys({ commit }, context) {
    const apiKeys: any = (await this.$axios.get("/users/me/api-keys")).data;
    commit("setApiKeys", apiKeys);
  },
  async deleteApiKey({ dispatch }, context) {
    await this.$axios.delete(`/users/me/api-keys/${context}`);
    return dispatch("getApiKeys");
  },
  async createApiKey({ dispatch }) {
    await this.$axios.put("/users/me/api-keys");
    return dispatch("getApiKeys");
  },
  async getEnable2FA({ commit }, context) {
    return (await this.$axios.get("/users/me/2fa/enable")).data;
  },
  async disable2FA({ dispatch }) {
    await this.$axios.delete("/users/me/2fa");
    return dispatch("getApiKeys");
  },
  async postVerify2FA({ dispatch }, context) {
    await this.$axios.post("/users/me/2fa/verify", { code: context });
    return dispatch("getUser");
  },
  async regenerateCodes({ dispatch }) {
    await this.$axios.get("/users/me/backup-codes/regenerate");
    return dispatch("getBackupCodes");
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user,
  emails: state => state.emails,
  apiKeys: state => state.apiKeys,
  memberships: state => state.memberships,
  securityEvents: state => state.securityEvents,
  backupCodes: state => state.backupCodes,
  isDownloading: state => state.isDownloading,
  notificationEmails: state => (state.user ? state.user.notificationEmails : 0)
};
