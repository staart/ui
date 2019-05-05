import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState, User } from "../types/settings";

export const state = (): RootState => ({});

export const mutations: MutationTree<RootState> = {
  updateUser(state: RootState, user: User): void {
    state.user = user;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async getUser({ commit }, context) {
    const user: User = (await this.$axios.get("/users/me")).data;
    commit("updateUser", user);
  },
  async updateUser({ dispatch }, context) {
    await this.$axios.patch("/users/me", context);
    return dispatch("getUser");
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user
};
