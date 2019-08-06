import { subscriptions, invoices, sources } from "stripe";
import { IdRow, Row, Paginated } from "./root";

export interface Organization extends IdRow {
  name?: string;
  stripeCustomerId?: string;
  username: string;
  autoJoinDomain: boolean;
  onlyAllowDomain: boolean;
}

export interface Membership extends IdRow {
  organization: Organization;
}
export interface ApiKey extends IdRow {
  name?: string;
  jwtApiKey: string;
  scopes: string;
  ipRestrictions?: string;
  referrerRestrictions?: string;
}
export type ApiKeyLogs = any;
export interface Domain extends Row {
  domain: string;
  verificationCode: string;
  isVerified: boolean;
}
export interface Webhook extends Row {
  url: string;
  event: string;
  secret: string;
  contentType: string;
  isActive: boolean;
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
export interface ApiKeys extends Paginated {
  data: ApiKey[];
}
export interface Domains extends Paginated {
  data: Domain[];
}
export interface Webhooks extends Paginated {
  data: Webhook[];
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
export interface ApiKeysKV {
  [index: string]: ApiKeys;
}
export interface DomainsKV {
  [index: string]: Domains;
}
export interface WebhooksKV {
  [index: string]: Webhooks;
}

export interface SingleSubscriptionKV {
  [index: string]: {
    [index: string]: subscriptions.ISubscription;
  };
}
export interface SingleInvoiceKV {
  [index: string]: {
    [index: string]: invoices.IInvoice;
  };
}
export interface SingleSourceKV {
  [index: string]: {
    [index: string]: sources.ISource;
  };
}
export interface SingleApiKeyKV {
  [index: string]: {
    [index: string]: ApiKey;
  };
}
export interface SingleApiKeyLogsKV {
  [index: string]: {
    [index: string]: ApiKeyLogs;
  };
}
export interface SingleDomainKV {
  [index: string]: {
    [index: string]: Domain;
  };
}
export interface SingleWebhookKV {
  [index: string]: {
    [index: string]: Webhook;
  };
}
export interface LoggedInMembershipsKV {
  [index: string]: number;
}

export interface RootState {
  membership?: Membership;
  loggedInMembership: LoggedInMembershipsKV;
  organizations: OrganizationsKV;
  memberships: MembershipsKV;
  subscriptions: SubscriptionsKV;
  subscription: SingleSubscriptionKV;
  billing: BillingKV;
  invoices: InvoicesKV;
  invoice: SingleInvoiceKV;
  sources: SourcesKV;
  source: SingleSourceKV;
  apiKeys: ApiKeysKV;
  apiKey: SingleApiKeyKV;
  apiKeyLogs: SingleApiKeyLogsKV;
  domains: DomainsKV;
  domain: SingleDomainKV;
  devWebhooks: WebhooksKV;
  devWebhook: SingleWebhookKV;
  pricingPlans?: any;
  recentEvents?: any;
  isDownloading: boolean;
}

export const emptyOrganization: Organization = {
  id: 0,
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
  name: "",
  username: "",
  stripeCustomerId: "",
  autoJoinDomain: false,
  onlyAllowDomain: false
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
};
export const emptyBilling: Billing = {
  email: "",
  address: emptyAddress
};
