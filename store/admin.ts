import { MutationTree, ActionTree, GetterTree } from "vuex";
import Vue from "vue";
import { RootState, emptyPagination } from "~/types/admin";

export const state = (): RootState => ({
  users: emptyPagination,
  organizations: emptyPagination,
  serverLogs: emptyPagination
});

export const mutations: MutationTree<RootState> = {
};

export const actions: ActionTree<RootState, RootState> = {
};

export const getters: GetterTree<RootState, RootState> = {
  users: state => () => state.users,
  organizations: state => () => state.organizations,
  serverLogs: state => () => state.serverLogs
};
