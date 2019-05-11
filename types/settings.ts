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

export interface Membership {
  id: number;
}

export interface SecurityEvent {
  id: number;
}

export interface RootState {
  user?: User;
  emails: Email[];
  memberships: Membership[];
  securityEvents: SecurityEvent[];
  isDownloading: boolean;
}
