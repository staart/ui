import { Context } from "@nuxt/types";

export default (context: Context) => {
  const { store, $axios } = context;

  if (store.state.auth.isAuthenticated) {
    $axios.setToken(store.state.auth.tokens.token, "Bearer");
  }

  if (store.state.auth?.user?.prefersReducedMotion === "REDUCE")
    if (document && document.body)
      document.documentElement.classList.add("prefers-reduced-motion");
  if (store.state.auth?.user?.prefersColorScheme === "DARK")
    if (document && document.body)
      document.documentElement.classList.add("prefers-color-scheme-dark");

  store
    .dispatch("auth/safeRefresh")
    .then(() => {})
    .catch(() => {});
};
