import { Context } from "@nuxt/types";

export default (context: Context) => {
  const { store, redirect } = context;
  if (process.client) {
    if (!store.state.auth.isAuthenticated) {
      redirect(401, "/auth/login");
    }
  }
};
