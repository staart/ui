import { Context } from "@nuxt/types";

export default (context: Context) => {
  const { store, redirect, query } = context;
  if (process.client) {
    if (store.state.auth.isAuthenticated) {
      if (typeof query.to === "string") return redirect(query.to);
      redirect("/");
    }
  }
};
