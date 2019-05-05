import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, User, Email } from "../types/settings";

export const state = (): RootState => ({});

export const mutations: MutationTree<RootState> = {
  setUser(state: RootState, user: User): void {
    state.user = user;
  },
  setEmails(state: RootState, emails: Email[]): void {
    state.emails = emails;
  },
  clearAll(state: RootState): void {
    delete state.user;
    delete state.emails;
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
    await this.$axios.put("/emails", context);
    return dispatch("getEmails");
  },
  async deleteEmail({ dispatch }, context) {
    await this.$axios.delete(`/emails/${context}`);
    return dispatch("getEmails");
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user,
  emails: state => state.emails
};
