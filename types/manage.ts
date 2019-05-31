export interface Organization {
  id: number;
}

export interface Membership {
  id: number;
  organization: Organization;
}

export interface Member {
  id: number;
}

export interface Members {
  data: Member[];
  hasMore: boolean;
  next?: number;
}

export interface RootState {
  membership?: Membership;
  organization?: Organization;
  members: Members;
  billing?: any;
  invoices?: any;
  subscriptions?: any;
  pricingPlans?: any;
  sources?: any;
  recentEvents?: any;
  isDownloading: boolean;
}
