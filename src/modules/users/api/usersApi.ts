import type { User } from "../types";

const BASE_URL = "https://dummyjson.com";

export const usersApi = {
  fetchById: async (id: number): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch user: ${response.statusText}`);
    return response.json();
  },
};
