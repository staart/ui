import wildcardMatch from "wildcard-match";

export type AuthState = "authenticated" | "expired" | "unauthenticated";

export const decode = (token: string) => {
  const [_, payload] = token.split(".");
  return JSON.parse(atob(payload));
};

export const getUserId = (): number | false => {
  try {
    const tokens = JSON.parse(window.localStorage.getItem("auth"));
    const [_, payload] = tokens.accessToken.split(".");
    return JSON.parse(atob(payload)).id;
  } catch (error) {}
  return false;
};

export const can = (scope: string): boolean => {
  try {
    const tokens = JSON.parse(window.localStorage.getItem("auth"));
    const [_, payload] = tokens.accessToken.split(".");
    const scopes = JSON.parse(atob(payload)).scopes as string[];
    let hasPermission = false;
    scopes.forEach((test) => {
      const isMatch = wildcardMatch(test);
      hasPermission = hasPermission || isMatch(scope);
    });
    return hasPermission;
  } catch (error) {}
  return false;
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
