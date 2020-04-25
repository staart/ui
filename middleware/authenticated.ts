import { Middleware } from "@nuxt/types";

const authenticated: Middleware = (context) => {
  const { store, redirect } = context;
  if (process.client) {
    if (!store.state.auth.isAuthenticated) {
      redirect(401, "/auth/login");
    }
  }
};

export default authenticated;
