export const actions = {
  async verify(store, { token, subject }: { token: string; subject: string }) {
    const result = await this.$axios.post("/auth/verify-token", {
      token,
      subject
    });
    return result.data;
  },
  async verifyEmail(store, token: string) {
    const result = await this.$axios.post("/emails/verify", {
      token
    });
    return result.data;
  }
};
