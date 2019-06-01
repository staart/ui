import { Context } from "@nuxt/vue-app";

export default function({ redirect, store, route }: Context) {
  if (!store.state.auth.isAuthenticated)
    return redirect(`/auth/login?redirect=${route.path}`);
}
