import { IdRow, Row, Paginated } from "./root";
import { Organization } from "./manage";

export interface User extends IdRow {
  name: string;
  username: string;
  nickname: string;
  primaryEmail: number;
  twoFactorEnabled: boolean;
  countryCode: string;
  timezone: string;
  notificationEmails: number;
  preferredLanguage: string;
  prefersReducedMotion: boolean;
  prefersColorSchemeDark: boolean;
  role: number;
  gender: "m" | "f" | "n" | "x";
  profilePicture: string;
}

export interface AccessToken extends IdRow {
  userId: number;
  jwtApiKey: string;
  scopes: string;
}
export interface Membership extends IdRow {
  userId: number;
  organizationId: number;
  organization: Organization;
  role: "1" | "2" | "3";
}

export interface AccessTokens extends Paginated {
  data: AccessToken[];
}
export interface Memberships extends Paginated {
  data: Membership[];
}

export interface UsersKV {
  [index: string]: User;
}
export interface AccessTokensKV {
  [index: string]: AccessTokens;
}
export interface MembershipsKV {
  [index: string]: Memberships;
}

export interface SingleAccessTokenKV {
  [index: string]: {
    [index: string]: AccessToken;
  };
}
export interface SingleMembershipKV {
  [index: string]: {
    [index: string]: Membership;
  };
}

export interface RootState {
  users: UsersKV;
  accessTokens: AccessTokensKV;
  accessToken: SingleAccessTokenKV;
  memberships: MembershipsKV;
  membership: SingleMembershipKV;
}

export const emptyUser: User = {
  id: 0,
  name: "",
  username: "",
  nickname: "",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  primaryEmail: 0,
  twoFactorEnabled: false,
  countryCode: "",
  timezone: "",
  notificationEmails: 1,
  preferredLanguage: "en",
  prefersColorSchemeDark: false,
  prefersReducedMotion: false,
  profilePicture: "",
  role: 1,
  gender: "x"
}
export const emptyPagination = {
  data: [],
  hasMore: false
};
