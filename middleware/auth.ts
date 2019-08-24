import { Context } from "@nuxt/types";

export default function({ redirect, store, route }: Context) {
  if (!store.state.auth.isAuthenticated) {
    return redirect(`/auth/login?redirect=${route.fullPath}`);
  }
}
