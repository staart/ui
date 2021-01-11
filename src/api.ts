import { users, activeUserIndex } from "./stores";
import { errors } from "./errors";
import type { User } from "./stores";
import decode from "jwt-decode";
import wcmatch from "wildcard-match";
import { titleCase } from "./helpers/string-utils";
import { getItem, setItem, removeItem } from "localforage";

const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3001/v1" : "http://localhost:3001/v1";

let loggedInUsers: User[] = [];
users.subscribe((users) => (loggedInUsers = users));

let index: number = 0;
activeUserIndex.subscribe((i) => (index = i));

let refreshing = false;

export const can = (scope: string): boolean => {
  try {
    const user = loggedInUsers[index];
    const token = user.auth.accessToken;
    const { scopes } = decode<{ scopes: string[] }>(token);
    const isMatch = wcmatch(scopes);
    return isMatch(scope);
  } catch (error) {}
  return false;
};

export const api = async <T>({
  method = "GET",
  url,
  onCachedResponse,
  body,
  token = "",
  formData = false,
  blob = false,
}: {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  url: string;
  onCachedResponse?: (data: T) => any;
  body?: any;
  token?: string;
  formData?: boolean;
  blob?: boolean;
}): Promise<T> => {
  if (refreshing) await wait(5000);
  const cacheKey = `api-cache-${url}`;

  try {
    if (method === "GET" && typeof onCachedResponse === "function") {
      const item = await getItem<{ data: T; date: Date }>(cacheKey);
      if (item) {
        if (new Date().getTime() - item.date.getTime() > 86400000) removeItem(cacheKey);
        else onCachedResponse(item.data);
      }
    }
  } catch (error) {}

  if (loggedInUsers.length && !token) {
    const user = loggedInUsers[index];
    if (user) token = user.auth.accessToken;
  }

  if (loggedInUsers.length && loggedInUsers[index]) {
    let isExpiredJwt = false;
    try {
      const { exp } = decode<{ exp: number }>(token);
      isExpiredJwt = new Date().getTime() > new Date(exp * 1000).getTime();
    } catch (error) {}
    if (isExpiredJwt) {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          body: JSON.stringify({
            token: loggedInUsers[index].auth.refreshToken,
          }),
          headers: {
            "X-Requested-With": "XmlHttpRequest",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const {
          accessToken,
          refreshToken,
        }: { accessToken: string; refreshToken: string } = await res.json();
        users.update((val) =>
          val.map((user, i) => {
            if (index === i) {
              return {
                details: user.details,
                memberships: user.memberships,
                auth: { accessToken, refreshToken },
              };
            }
            return user;
          })
        );
        token = accessToken;
      } catch (error) {}
    }
  }

  const options: RequestInit = {
    method,
    headers: {
      "X-Requested-With": "XmlHttpRequest",
      Accept: "application/json",
      Authorization: token && `Bearer ${token}`,
    },
  };
  if (!formData) options.headers["Content-Type"] = "application/json";
  if (body && !formData) options.body = JSON.stringify(body);
  else options.body = body;

  const res = await fetch(`${BASE_URL}${url}`, options);
  if (!res.ok) {
    let errorTitle = "";
    if (res.status === 404) errorTitle = "Not found";
    if (res.status === 400) errorTitle = "Oops, something went wrong";
    if (res.status === 429) errorTitle = "Slow down, tiger!";

    if (res.status === 401) {
      users.set([]);
      activeUserIndex.set(0);
      window.location.href = "/";
    }

    let errorMessage = "An unknown error occurred in performing your request";
    try {
      const json = await res.json();
      if (json.message) {
        if (Array.isArray(json.message)) errorMessage = json.message.map(titleCase).join(", ");
        else errorMessage = errors[json.message.split(":")[0]] || String(json.message);
      }
    } catch (error) {}

    throw new Error(errorTitle ? `${errorMessage}\n${errorTitle}` : errorMessage);
  }
  if (blob) {
    const blob = await res.blob();
    return (blob as any) as T;
  } else {
    const json: T = await res.json();
    if (method === "GET" && !url.includes("cursor"))
      await setItem(cacheKey, { date: new Date(), data: json });
    return json;
  }
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const loginWithTokenResponse = async (auth: User["auth"]) => {
  if (!auth.accessToken) return;
  const userId = decode<{ id: number }>(auth.accessToken).id;
  const details = await api<User["details"]>({
    method: "GET",
    url: `/users/${userId}`,
    token: auth.accessToken,
  });
  const memberships = await api<any>({
    method: "GET",
    url: `/users/${userId}/memberships`,
    token: auth.accessToken,
  });
  users.update((val) =>
    [...val, { details, memberships, auth }].filter(
      (v, i, a) => a.map((i) => i.details.id).indexOf(v.details.id) === i
    )
  );
  activeUserIndex.set(loggedInUsers.length - 1);
};

export const refresh = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({
        token: loggedInUsers[index].auth.refreshToken,
      }),
      headers: {
        "X-Requested-With": "XmlHttpRequest",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string } = await res.json();
    const memberships = await api<any[]>({
      method: "GET",
      url: `/users/${loggedInUsers[index].details.id}/memberships`,
    });
    users.update((val) =>
      val.map((user, i) => {
        if (index === i) {
          return {
            details: user.details,
            memberships,
            auth: { accessToken, refreshToken },
          };
        }
        return user;
      })
    );
  } catch (error) {}
};
