import decode from "jwt-decode";

export const state = () => ({
  tokens: {},
  user: {},
  isAuthenticated: false
});

export const mutations = {
  setTokens(store, tokens) {
    store.tokens = tokens;
    store.isAuthenticated = true;
    store.user = decode(tokens.token);
  }
};

export const actions = {
  async loginWithEmailPassword(
    store,
    { email, password }: { email: string; password: string }
  ) {
    const tokens = await this.$axios.post("/auth/login", { email, password });
    console.log(tokens);
  },
  async register(
    store,
    { name, email, password }: { name: string; email: string; password: string }
  ) {
    const response = await this.$axios.put("/users", {
      name,
      email,
      password
    });
    return response;
  }
};

export const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
};
