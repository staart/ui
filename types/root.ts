export interface Row {
  createdAt: string;
  updatedAt: string;
}

export interface IdRow extends Row {
  id: number;
}

export interface Paginated {
  hasMore: boolean;
  next?: number;
}
