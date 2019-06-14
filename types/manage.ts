import { IdRow } from "./root";

export interface Organization extends IdRow {
  invitationDomain?: string;
  name?: string;
  stripeCustomerId?: string;
}

export interface Membership extends IdRow {
  organization: Organization;
}

export interface Members {
  data: Membership[];
  hasMore: boolean;
  next?: number;
}
export interface OrganizationsKV {
  [index: string]: Organization;
}
export interface MembershipsKV {
  [index: string]: Members;
}

export interface RootState {
  membership?: Membership;
  organizations: OrganizationsKV;
  memberships: MembershipsKV;
  billing?: any;
  invoices?: any;
  subscriptions?: any;
  pricingPlans?: any;
  sources?: any;
  recentEvents?: any;
  isDownloading: boolean;
}

export const emptyOrganization: Organization = {
  id: 0,
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  name: "",
  invitationDomain: "",
  stripeCustomerId: ""
};
export const emptyMembers: Members = {
  data: [],
  hasMore: false
};
