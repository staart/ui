export interface Organization {
  id: number;
}

export interface Membership {
  id: number;
  organization: Organization;
}

export interface RootState {
  membership?: Membership;
  organization?: Organization;
}
