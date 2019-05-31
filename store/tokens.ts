import { ActionTree } from "vuex";
import { RootState } from "../types/settings";

export const state = () => ({});

export const actions: ActionTree<RootState, RootState> = {
  async verify({ commit }, context) {
    const data = (await this.$axios.post("/auth/verify-token", context)).data;
    return data;
  },
  async verifyEmail({ commit }, context) {
    const data = (await this.$axios.post("/auth/verify-email", context)).data;
    return data;
  },
  async approveLocation({ commit }, context) {
    const data = (await this.$axios.post("/auth/approve-location", context))
      .data;
    if (data.token) {
      this.$axios.setToken(data.token, "Bearer");
      commit("auth/setAuthentication", data, { root: true });
    }
    return data;
  }
};
