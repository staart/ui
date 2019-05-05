export interface User {
  id: number;
  name: string;
  nickname: string;
  countryCode: string;
  notificationEmails: number;
  preferredLanguage: string;
  prefersReducedMotion: boolean;
  role: number;
  timezone: string;
  twoFactorEnabled: boolean;
}

export interface Email {
  id: number;
}

export interface SecurityEvent {
  id: number;
}

export interface RootState {
  user?: User;
  emails: Email[];
  securityEvents: SecurityEvent[];
}
