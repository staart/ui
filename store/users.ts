import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import { RootState, User, emptyPagination } from "~/types/users";

export const state = (): RootState => ({
  users: {},
  accessTokens: {},
  accessToken: {},
  memberships: {},
  membership: {},
  emails: {},
  email: {}
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
  setMemberships(state: RootState, { slug, memberships, start, next }): void {
    const currentMemberships = state.memberships;
    currentMemberships[slug] = currentMemberships[slug] || emptyPagination;
    if (start) {
      currentMemberships[slug].data = [
        ...currentMemberships[slug].data,
        ...memberships.data
      ];
    } else {
      currentMemberships[slug].data = memberships.data;
    }
    currentMemberships[slug].next = next;
    Vue.set(state, "memberships", currentMemberships);
  },
  setMembership(state: RootState, { slug, membership, id }): void {
    const currentMemberships = state.membership;
    currentMemberships[slug] = currentMemberships[slug] || {};
    currentMemberships[slug][id] = { ...membership };
    Vue.set(state, "membership", currentMemberships);
  },
  setEmails(state: RootState, { slug, emails, start, next }): void {
    const currentEmails = state.emails;
    currentEmails[slug] = currentEmails[slug] || emptyPagination;
    if (start) {
      currentEmails[slug].data = [
        ...currentEmails[slug].data,
        ...emails.data
      ];
    } else {
      currentEmails[slug].data = emails.data;
    }
    currentEmails[slug].next = next;
    Vue.set(state, "emails", currentEmails);
  },
  setEmail(state: RootState, { slug, email, id }): void {
    const currentEmails = state.email;
    currentEmails[slug] = currentEmails[slug] || {};
    currentEmails[slug][id] = { ...email };
    Vue.set(state, "email", currentEmails);
  },
  clearAll(state: RootState): void {
    delete state.accessTokens;
    delete state.accessToken;
    delete state.memberships;
    delete state.membership;
    delete state.emails;
    delete state.email;
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
  },
  async getMemberships({ commit }, { slug, start = 0 }) {
    const memberships: any = (await this.$axios.get(
      `/users/${slug}/memberships?start=${start}`
    )).data;
    commit("setMemberships", { slug, memberships, start, next: memberships.next });
    return memberships;
  },
  async getMembership({ commit }, { slug, id }) {
    const membership: any = (await this.$axios.get(
      `/users/${slug}/memberships/${id}`
    )).data;
    commit("setMembership", { slug, membership, id });
    return membership;
  },
  async deleteMembership({ dispatch }, context) {
    await this.$axios.delete(
      `/${context.slug}/memberships/${context.id}`
    );
    return dispatch("getMemberships", { slug: context.slug });
  },
  async getEmails({ commit }, { slug, start = 0 }) {
    const emails: any = (await this.$axios.get(
      `/users/${slug}/emails?start=${start}`
    )).data;
    commit("setEmails", { slug, emails, start, next: emails.next });
    return emails;
  },
  async getEmail({ commit }, { slug, id }) {
    const email: any = (await this.$axios.get(
      `/users/${slug}/emails/${id}`
    )).data;
    commit("setEmail", { slug, email, id });
    return email;
  },
  async createEmail({ dispatch }, context) {
    const data = { ...context };
    delete data.slug;
    await this.$axios.put(`/users/${context.slug}/emails`, data);
    return dispatch("getEmails", { slug: context.slug });
  },
  async deleteEmail({ dispatch }, context) {
    await this.$axios.delete(
      `/users/${context.slug}/emails/${context.id}`
    );
    return dispatch("getEmails", { slug: context.slug });
  },
  async resendEmail({}, context) {
    return await this.$axios.post(
      `/users/${context.slug}/emails/${context.id}/resend`
    );
  },
  async createOrganization({ dispatch }, context) {
    const slug = context.slug;
    delete context.slug;
    await this.$axios.put("/organizations", context);
    return dispatch("getMemberships", { slug });
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => (slug: string) => state.users[slug],
  accessTokens: state => (slug: string) => state.accessTokens[slug],
  accessToken: state => (slug: string, accessToken: string) =>
    state.accessToken[slug] && state.accessToken[slug][accessToken],
  memberships: state => (slug: string) => state.memberships[slug],
  membership: state => (slug: string, membership: string) =>
    state.membership[slug] && state.membership[slug][membership],
  emails: state => (slug: string) => state.emails[slug],
  email: state => (slug: string, email: string) =>
    state.email[slug] && state.email[slug][email],
};
