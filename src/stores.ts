import { writable } from "svelte/store";

export interface User {
  auth: { accessToken: string; refreshToken: string };
  memberships: {
    id: number;
    group: {
      id: number;
      name: string;
      profilePictureUrl: string;
      role: "ADMIN" | "OWNER" | "MEMBER";
    };
  }[];
  details: {
    checkLocationOnLogin: boolean;
    countryCode: string;
    gender: string;
    id: number;
    name: string;
    prefersLanguage: string;
    prefersColorScheme: string;
    prefersReducedMotion: string;
    prefersEmailId: 1;
    profilePictureUrl: string;
    role: "USER" | "SUDO";
    timezone: string;
  };
}

let usersDefaultVal: User[] = [];
try {
  if (typeof window !== "undefined" && "localStorage" in window) {
    const val = localStorage.getItem("users");
    if (val) usersDefaultVal = JSON.parse(val);
  }
} catch (error) {}
export const users = writable<User[]>(usersDefaultVal);
users.subscribe(
  (val) =>
    typeof window !== "undefined" &&
    "localStorage" in window &&
    localStorage.setItem("users", JSON.stringify(val))
);

let activeUserIndexDefaultVal: number = 0;
try {
  if (typeof window !== "undefined" && "localStorage" in window) {
    const val = localStorage.getItem("activeUserIndex");
    if (val) activeUserIndexDefaultVal = JSON.parse(val);
  }
} catch (error) {}
export const activeUserIndex = writable<number>(activeUserIndexDefaultVal);
activeUserIndex.subscribe(
  (val) =>
    typeof window !== "undefined" &&
    "localStorage" in window &&
    localStorage.setItem("activeUserIndex", JSON.stringify(val))
);

export const activeNotification = writable<{
  text: string;
  type: string;
} | null>(null);
activeNotification.subscribe(() => setTimeout(() => activeNotification.set(null), 3500));
