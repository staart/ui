import { Paginated } from "./root";
import { User } from "./users";
import { Organization } from "./manage";

export interface ElasticSearchRecord {
  _index: string;
  _type: string;
  _id: string;
  _score: number | null;
  _source: {
    [index: string]: any;
  };
  sort?: number[];
}

export interface Users extends Paginated {
  data: User[];
}
export interface Organizations extends Paginated {
  data: Organization[];
}
export interface ServerLogs extends Paginated {
  data: ElasticSearchRecord[];
}

export interface RootState {
  users: Users,
  organizations: Organizations,
  serverLogs: ServerLogs
}

export const emptyPagination = {
  data: [],
  hasMore: false
};
