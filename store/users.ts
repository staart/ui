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
  setApiKeys(state: RootState, { slug, accessTokens, start, next }): void {
    const currentApiKeys = state.accessTokens;
    currentApiKeys[slug] = currentApiKeys[slug] || emptyPagination;
    if (start) {
      currentApiKeys[slug].data = [
        ...currentApiKeys[slug].data,
        ...accessTokens.data
      ];
    } else {
      currentApiKeys[slug].data = accessTokens.data;
    }
    currentApiKeys[slug].next = next;
    Vue.set(state, "accessTokens", currentApiKeys);
  },
  setApiKey(state: RootState, { slug, accessToken, id }): void {
    const currentApiKeys = state.accessToken;
    currentApiKeys[slug] = currentApiKeys[slug] || {};
    currentApiKeys[slug][id] = { ...accessToken };
    Vue.set(state, "accessToken", currentApiKeys);
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
  async getApiKeys({ commit }, { slug, start = 0 }) {
    const accessTokens: any = (await this.$axios.get(
      `/organizations/${slug}/api-keys?start=${start}`
    )).data;
    commit("setApiKeys", { slug, accessTokens, start, next: accessTokens.next });
    return accessTokens;
  },
  async getApiKey({ commit }, { slug, id }) {
    const accessToken: any = (await this.$axios.get(
      `/organizations/${slug}/api-keys/${id}`
    )).data;
    commit("setApiKey", { slug, accessToken, id });
    return accessToken;
  },
  async createApiKey({ dispatch }, context) {
    const data = { ...context };
    delete data.slug;
    await this.$axios.put(`/organizations/${context.slug}/api-keys`, data);
    return dispatch("getApiKeys", { slug: context.slug });
  },
  async deleteApiKey({ dispatch }, context) {
    await this.$axios.delete(
      `/organizations/${context.slug}/api-keys/${context.id}`
    );
    return dispatch("getApiKeys", { slug: context.slug });
  },
  async updateApiKey({ dispatch }, context) {
    const data = { ...context };
    delete data.slug;
    delete data.id;
    await this.$axios.patch(
      `/organizations/${context.slug}/api-keys/${context.id}`,
      data
    );
    return dispatch("getApiKey", context);
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => (slug: string) => state.users[slug],
  accessTokens: state => (slug: string) => state.accessTokens[slug],
  accessToken: state => (slug: string, accessToken: string) =>
    state.accessToken[slug] && state.accessToken[slug][accessToken],
};
