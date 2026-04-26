export interface LoginInput {
  username: string;
  password: string;
}

export type UserRole = "admin" | "user";

export interface AuthUser {
  username: string;
  isPremium: boolean;
  role: UserRole;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}
