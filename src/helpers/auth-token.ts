export type AuthState = "authenticated" | "expired" | "unauthenticated";

export const getAuthenticatedState = (): AuthState => {
  if (typeof window !== "undefined") {
    const tokens = window.localStorage.getItem("staart-auth");
    if (tokens) {
      const {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string } = JSON.parse(tokens);
      console.log(accessToken, refreshToken);
    }
  }
  return "unauthenticated";
};
