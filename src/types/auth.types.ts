export type Role = "superadmin" | "admin" | "tashkilot" | "user";

export interface User {
  id: string;
  ism: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
