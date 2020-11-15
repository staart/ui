export type AuthState = "authenticated" | "expired" | "unauthenticated";

export const decode = (token: string) => {
  const [_, payload] = token.split(".");
  return JSON.parse(atob(payload));
};

export const getAuthenticatedState = (): AuthState => {
  if (typeof window !== "undefined") {
    const tokens = window.localStorage.getItem("auth");
    if (tokens) {
      const {
        accessToken,
      }: { accessToken: string; refreshToken: string } = JSON.parse(tokens);
      try {
        const decoded = decode(accessToken) as { exp: number };
        if (decoded.exp * 1000 < new Date().getTime()) return "expired";
        return "authenticated";
      } catch (error) {}
    }
  }
  return "unauthenticated";
};
