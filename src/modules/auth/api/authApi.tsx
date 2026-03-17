import type { AuthUser, LoginPayload, RegisterPayload } from "../types";

const BASE_URL = "https://dummyjson.com";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, expiresInMins: 30 }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Invalid credentials");
    }
    return response.json();
  },

  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const response = await fetch(`${BASE_URL}/users/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Registration failed");
    }
    return response.json();
  },
};
