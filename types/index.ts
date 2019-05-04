export interface Tokens {
  token: string;
  refresh: string;
}

export interface User {
  id: number;
}

export interface RootState {
  isAuthenticated: boolean;
  tokens: Tokens;
  user?: User;
}
