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

export interface RootState {
  membership?: Membership;
  organization?: Organization;
  members: Member[];
}
