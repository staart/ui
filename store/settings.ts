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
  emails: { data: [], hasMore: false },
  memberships: { data: [], hasMore: false },
  securityEvents: { data: [], hasMore: false },
  isDownloading: false,
  backupCodes: []
});

export const mutations: MutationTree<RootState> = {
  setUser(state: RootState, user: User): void {
    Vue.set(state, "user", user);
    try {
      if (process.client) {
        if (user.prefersReducedMotion) {
          document.documentElement.classList.add("prefers-reduced-motion");
        } else {
          document.documentElement.classList.remove("prefers-reduced-motion");
        }
        if (user.prefersColorSchemeDark) {
          document.documentElement.classList.add("prefers-color-scheme-dark");
        } else {
          document.documentElement.classList.remove(
            "prefers-color-scheme-dark"
          );
        }
      }
    } catch (error) {}
  },
  setEmails(state: RootState, { start, emails }): void {
    if (start) {
      const currentValue = state.emails;
      emails.data = [...currentValue.data, ...emails.data];
      Vue.set(state, "emails", emails);
    } else {
      Vue.set(state, "emails", emails);
    }
  },
  setMemberships(state: RootState, { memberships, start }): void {
    if (start) {
      const currentValue = state.memberships;
      memberships.data = [...currentValue.data, ...memberships.data];
      Vue.set(state, "memberships", memberships);
    } else {
      Vue.set(state, "memberships", memberships);
    }
  },
  setSecurityEvents(state: RootState, { securityEvents, start }): void {
    if (start) {
      const currentValue = state.securityEvents;
      securityEvents.data = [...currentValue.data, ...securityEvents.data];
      Vue.set(state, "securityEvents", securityEvents);
    } else {
      Vue.set(state, "securityEvents", securityEvents);
    }
  },
  setBackupCodes(state: RootState, backupCodes: BackupCode[]): void {
    Vue.set(state, "backupCodes", backupCodes);
  },
  clearAll(state: RootState): void {
    delete state.user;
    delete state.emails;
    delete state.memberships;
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
  async updatePassword({ dispatch }, context) {
    await this.$axios.put("/users/me/password", context);
    return dispatch("getUser");
  },
  async getEmails({ commit }, start = 0) {
    const emails: Email[] = (await this.$axios.get(
      `/users/me/emails?start=${start}`
    )).data;
    commit("setEmails", { emails, start });
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
  async getEvents({ commit }, start = 0) {
    const securityEvents: SecurityEvent[] = (await this.$axios.get(
      `/users/me/events?start=${start}&sort=desc`
    )).data;
    commit("setSecurityEvents", { securityEvents, start });
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
  async getMemberships({ commit }, start = 0) {
    const memberships: Membership[] = (await this.$axios.get(
      `/users/me/memberships?start=${start}`
    )).data;
    commit("setMemberships", { memberships, start });
    return memberships;
  },
  async deleteMembership({ dispatch }, context) {
    await this.$axios.delete(`/memberships/${context}`);
    return dispatch("getMemberships");
  },
  async createOrganization({ dispatch }, context) {
    await this.$axios.put("/organizations", context);
    return dispatch("getMemberships");
  },
  async getEnable2FA({ commit }, context) {
    return (await this.$axios.get("/users/me/2fa/enable")).data;
  },
  async disable2FA({ dispatch }) {
    await this.$axios.delete("/users/me/2fa");
  },
  async postVerify2FA({ dispatch }, context) {
    await this.$axios.post("/users/me/2fa/verify", { code: context });
    await dispatch("getBackupCodes");
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
  memberships: state => state.memberships,
  securityEvents: state => state.securityEvents,
  backupCodes: state => state.backupCodes,
  isDownloading: state => state.isDownloading,
  notificationEmails: state => (state.user ? state.user.notificationEmails : 0)
};
