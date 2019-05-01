export const actions = {
  async verify(store, { token, subject }: { token: string; subject: string }) {
    const result = await this.$axios.post("/auth/verify-token", {
      token,
      subject
    });
    return result.data;
  },
  async verifyEmail(store, { token }: { token: string }) {
    const result = await this.$axios.post("/emails/verify", {
      token
    });
    return result.data;
  },
  async approveLocation(store, { token }: { token: string }) {
    const result = await this.$axios.post("/auth/approve-location", {
      token
    });
    if (result.data.token) {
      const tokens = result.data;
      console.log(tokens);
      store.commit("auth/setTokens", tokens, { root: true });
    }
  }
};
