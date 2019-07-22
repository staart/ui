import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import { RootState, User, emptyPagination } from "~/types/users";

export const state = (): RootState => ({
  users: {},
  accessTokens: {},
  accessToken: {}
});

export const mutations: MutationTree<RootState> = {
  setUser(state: RootState, user: User): void {
    const users = state.users;
    users[user.id] = user;
    Vue.set(state, "users", users);
  },
  setAccessTokens(state: RootState, { slug, accessTokens, start, next }): void {
    const currentAccessTokens = state.accessTokens;
    currentAccessTokens[slug] = currentAccessTokens[slug] || emptyPagination;
    if (start) {
      currentAccessTokens[slug].data = [
        ...currentAccessTokens[slug].data,
        ...accessTokens.data
      ];
    } else {
      currentAccessTokens[slug].data = accessTokens.data;
    }
    currentAccessTokens[slug].next = next;
    Vue.set(state, "accessTokens", currentAccessTokens);
  },
  setAccessToken(state: RootState, { slug, accessToken, id }): void {
    const currentAccessTokens = state.accessToken;
    currentAccessTokens[slug] = currentAccessTokens[slug] || {};
    currentAccessTokens[slug][id] = { ...accessToken };
    Vue.set(state, "accessToken", currentAccessTokens);
  },
  clearAll(state: RootState): void {
    delete state.accessTokens;
    delete state.accessToken;
  }
};

export const actions: ActionTree<RootState, RootState> = {
  async getUser({ commit }, context) {
    const user: User = (await this.$axios.get(
      `/users/${context}`
    )).data;
    commit("setUser", user);
    return user;
  },
  async updateUser({ dispatch }, context) {
    const update = { ...context };
    delete update.slug;
    await this.$axios.patch(`/users/${context.slug}`, update);
    return dispatch("getUser", context.username || context.slug);
  },
  async deleteUser({ commit, rootGetters }, { slug }) {
    await this.$axios.delete(`/users/${slug}`);
    commit("clearAll");
  },
  async getAccessTokens({ commit }, { slug, start = 0 }) {
    const accessTokens: any = (await this.$axios.get(
      `/users/${slug}/access-tokens?start=${start}`
    )).data;
    commit("setAccessTokens", { slug, accessTokens, start, next: accessTokens.next });
    return accessTokens;
  },
  async getAccessToken({ commit }, { slug, id }) {
    const accessToken: any = (await this.$axios.get(
      `/users/${slug}/access-tokens/${id}`
    )).data;
    commit("setAccessToken", { slug, accessToken, id });
    return accessToken;
  },
  async createAccessToken({ dispatch }, context) {
    const data = { ...context };
    delete data.slug;
    await this.$axios.put(`/users/${context.slug}/access-tokens`, data);
    return dispatch("getAccessTokens", { slug: context.slug });
  },
  async deleteAccessToken({ dispatch }, context) {
    await this.$axios.delete(
      `/users/${context.slug}/access-tokens/${context.id}`
    );
    return dispatch("getAccessTokens", { slug: context.slug });
  },
  async updateAccessToken({ dispatch }, context) {
    const data = { ...context };
    delete data.slug;
    delete data.id;
    await this.$axios.patch(
      `/users/${context.slug}/access-tokens/${context.id}`,
      data
    );
    return dispatch("getAccessToken", context);
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => (slug: string) => state.users[slug],
  accessTokens: state => (slug: string) => state.accessTokens[slug],
  accessToken: state => (slug: string, accessToken: string) =>
    state.accessToken[slug] && state.accessToken[slug][accessToken],
};
