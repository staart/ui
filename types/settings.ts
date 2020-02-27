import { Organization } from "./manage";

export interface User {
  id: number;
  name: string;
  nickname: string;
  countryCode: string;
  notificationEmails: number;
  preferredLanguage: string;
  prefersReducedMotion: boolean;
  prefersColorSchemeDark: boolean;
  role: number;
  timezone: string;
  twoFactorEnabled: boolean;
}

export interface Email {
  id: number;
}
export interface Emails {
  data: Email[];
  hasMore: boolean;
  next?: number;
}

export interface Membership {
  id: number;
  organization: Organization;
}
export interface Memberships {
  data: Membership[];
  hasMore: boolean;
  next?: number;
}

export interface SecurityEvent {
  id: number;
}
export interface SecurityEvents {
  data: SecurityEvent[];
  hasMore: boolean;
  next?: number;
}

export interface BackupCode {
  id: number;
}

export interface RootState {
  user?: User;
  emails: Emails;
  memberships: Memberships;
  securityEvents: SecurityEvents;
  backupCodes: BackupCode[];
  isDownloading: boolean;
}
