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
  isAuthenticated: state => state.isAuthenticated
};
