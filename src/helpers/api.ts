export const BASE_URL = "http://localhost:3000/v1";

import type { TokenResponse } from "@staart/api/src/modules/auth/auth.interface";
import { getAuthenticatedState } from "./auth-token";
import { getMessageFromCode } from "./errors";
// import PQueue from "p-queue";

// const queue = new PQueue({ concurrency: 1 });

export const api = async <T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> => callApiMethod(method, endpoint, body);

const callApiMethod = async <T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const state = getAuthenticatedState();
  if (state === "authenticated") {
    const { accessToken } = JSON.parse(window.localStorage.getItem("auth"));
    headers.Authorization = `Bearer ${accessToken}`;
  } else if (state === "expired") {
    const { refreshToken } = JSON.parse(window.localStorage.getItem("auth"));
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers,
      body: JSON.stringify({ token: refreshToken }),
    });
    const tokens = (await response.json()) as TokenResponse;
    window.localStorage.setItem("auth", JSON.stringify(tokens));
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: typeof body === "object" ? JSON.stringify(body) : body,
  });
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const result = await response.json();
  if (!response.ok)
    if (Array.isArray(result.message))
      throw new Error(
        /**
         * Join an array using "A, B, and C" rather than "A, B, C"
         * @source https://stackoverflow.com/a/49289042/1656944
         */
        capitalize(result.message.join(", ").replace(/, ([^,]*)$/, ", and $1"))
      );
    else if (typeof result.message === "string")
      throw new Error(
        getMessageFromCode(result.message) ?? capitalize(result.message)
      );
    else throw new Error(capitalize(result.error ?? "An error occurred"));
  return result;
};
