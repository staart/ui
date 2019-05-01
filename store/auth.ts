export const state = () => ({
  tokens: {},
  user: {},
  isAuthenticated: false
});

export const mutations = {
  login(state, title) {
    state.list.push(title);
  }
};

export const actions = {
  async loginWithEmailPassword(
    store,
    { email, password }: { email: string; password: string }
  ) {
    const tokens = await this.$axios.post("/auth/login", { email, password });
    console.log(tokens);
  }
};

export const getters = {
  isAuthenticated: state => state.isAuthenticated
};
