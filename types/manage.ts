import { IdRow, Paginated } from "./root";
import { subscriptions, invoices, sources } from "stripe";

export interface Organization extends IdRow {
  invitationDomain?: string;
  name?: string;
  stripeCustomerId?: string;
}

export interface Membership extends IdRow {
  organization: Organization;
}
export interface Members extends Paginated {
  data: Membership[];
}
export interface Subscriptions extends Paginated {
  data: subscriptions.ISubscription[];
}
export interface Invoices extends Paginated {
  data: invoices.IInvoice[];
}
export interface Sources extends Paginated {
  data: sources.ISource[];
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
export interface SubscriptionsKV {
  [index: string]: Subscriptions;
}
export interface InvoicesKV {
  [index: string]: Invoices;
}
export interface SourcesKV {
  [index: string]: Sources;
}
export interface SingleSubscriptionKV {
  [index: string]: {
    [index: string]: subscriptions.ISubscription;
  }
}
export interface SingleInvoiceKV {
  [index: string]: {
    [index: string]: invoices.IInvoice;
  }
}
export interface SingleSourceKV {
  [index: string]: {
    [index: string]: sources.ISource;
  }
}

export interface RootState {
  membership?: Membership;
  organizations: OrganizationsKV;
  memberships: MembershipsKV;
  subscriptions: SubscriptionsKV;
  subscription: SingleSubscriptionKV;
  billing: BillingKV;
  invoices: InvoicesKV;
  invoice: SingleInvoiceKV;
  sources: SourcesKV;
  source: SingleSourceKV;
  pricingPlans?: any;
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
export const emptyPagination = {
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
