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
export interface Address {
  state: string;
  country: string;
  city: string;
  line1: string;
  line2?: string;
  postal_code: string;
}
export interface Billing {
  name?: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface OrganizationsKV {
  [index: string]: Organization;
}
export interface MembershipsKV {
  [index: string]: Members;
}

export interface BillingKV {
  [index: string]: Billing;
}

export interface RootState {
  membership?: Membership;
  organizations: OrganizationsKV;
  memberships: MembershipsKV;
  billing: BillingKV;
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
export const emptyAddress: Address = {
  state: "",
  country: "",
  line1: "",
  city: "",
  postal_code: ""
}
export const emptyBilling: Billing = {
  email: "",
  address: emptyAddress
};
