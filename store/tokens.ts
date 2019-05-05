import { ActionTree } from "vuex";
import { RootState } from "../types/settings";

export const state = (): RootState => ({});

export const actions: ActionTree<RootState, RootState> = {
  async verify({ commit }, context) {
    const data = (await this.$axios.post("/auth/verify-token", context)).data;
    return data;
  },
  async verifyEmail({ commit }, context) {
    const data = (await this.$axios.post("/emails/verify", context)).data;
    return data;
  },
  async approveLocation({ commit }, context) {
    const data = (await this.$axios.post("/auth/approve-location", context))
      .data;
    if (data.token) {
      commit("auth/setAuthentication", data, { root: true });
    }
    return data;
  }
};
