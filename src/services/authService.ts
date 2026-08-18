import { apiClient, AUTH_TOKEN_KEY } from "@/api/client";
import type { AuthRecord, AuthUser, LoginCredentials } from "@/types/auth";

const STORED_USER_KEY = "eventhub_lite_user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // json-server has no login logic of its own — we look up the matching
    // record by email and treat that as "authenticated" (any password is
    // accepted, same as the previous MSW-backed version).
    const { data } = await apiClient.get<AuthRecord[]>("/auth", {
      params: { email: credentials.email },
    });
    const record = data[0];
    if (!record) {
      throw new Error("Invalid email or password.");
    }

    const user: AuthUser = { id: record.id, name: record.name, email: record.email, role: record.role };
    localStorage.setItem(AUTH_TOKEN_KEY, record.token);
    localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(STORED_USER_KEY);
  },

  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(STORED_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
