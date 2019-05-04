import { MutationTree, ActionTree, GetterTree } from "vuex";
import decode from "jwt-decode";
import { RootState, Tokens } from "../types/auth";

export const state = (): RootState => ({
  isAuthenticated: false,
  tokens: {
    token: "",
    refresh: ""
  }
});

export const mutations: MutationTree<RootState> = {
  setAuthentication(state: RootState, tokens: Tokens): void {
    state.tokens = tokens;
    state.isAuthenticated = true;
    state.user = decode(tokens.token);
  }
};

export const actions: ActionTree<RootState, RootState> = {
  nuxtServerInit({ commit }, context) {
    if (!context.isStatic) {
    }
  },
  async loginWithEmailPassword({ commit }, context) {
    const tokens: Tokens = (await this.$axios.post("/auth/login", {
      email: context.email,
      password: context.password
    })).data;
    console.log("Got tokens", tokens);
    commit("setAuthentication", tokens);
  }
};

export const getters: GetterTree<RootState, RootState> = {
  user: state => state.user,
  isAuthenticated: state => state.isAuthenticated
};
