export interface AuthUser {
  id: string;
  avatar: string | null;
  email: string | null;
  name: string | null;
}

export interface AuthState {
  isInitialised: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
}
