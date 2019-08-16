import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import { RootState, emptyPagination } from "~/types/admin";

export const state = (): RootState => ({
  users: emptyPagination,
  organizations: emptyPagination,
  serverLogs: emptyPagination
});

export const mutations: MutationTree<RootState> = {
  setUsers(state: RootState, { users, start, next }): void {
    const currentUsers = { ...state.users } || emptyPagination;
    if (start) {
      currentUsers.data = [
        ...currentUsers.data,
        ...users.data
      ];
    } else {
      currentUsers.data = users.data;
    }
    currentUsers.next = next;
    Vue.set(state, "users", currentUsers);
  },
  setOrganizations(state: RootState, { organizations, start, next }): void {
    const currentOrganizations = { ...state.organizations } || emptyPagination;
    if (start) {
      currentOrganizations.data = [
        ...currentOrganizations.data,
        ...organizations.data
      ];
    } else {
      currentOrganizations.data = organizations.data;
    }
    currentOrganizations.next = next;
    Vue.set(state, "organizations", currentOrganizations);
  },
  setServerLogs(state: RootState, { serverLogs, from }): void {
    let currentServerLogs = { ...state.serverLogs } || emptyPagination;
    if (from) {
      currentServerLogs.data = [
        ...currentServerLogs.data,
        ...serverLogs.data
      ];
    } else {
      currentServerLogs = { ...serverLogs };
    }
    Vue.set(state, "serverLogs", currentServerLogs);
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async getUsers({ commit }, { start = 0 }) {
    const users: any = (await this.$axios.get(
      `/admin/users?start=${start}&itemsPerPage=20`
    )).data;
    commit("setUsers", {
      users,
      start,
      next: users.next
    });
    return users;
  },
  async getOrganizations({ commit }, { start = 0 }) {
    const organizations: any = (await this.$axios.get(
      `/admin/organizations?start=${start}&itemsPerPage=20`
    )).data;
    commit("setOrganizations", {
      organizations,
      start,
      next: organizations.next
    });
    return organizations;
  },
  async getServerLogs({ commit }, { range, from }) {
    const serverLogs: any = (await this.$axios.get(
      `/admin/server-logs?range=${range}&from=${from}`
    )).data;
    commit("setServerLogs", {
      serverLogs, range, from
    });
    return serverLogs;
  }
};

export const getters: GetterTree<RootState, RootState> = {
  users: state => () => state.users,
  organizations: state => () => state.organizations,
  serverLogs: state => () => state.serverLogs
};
