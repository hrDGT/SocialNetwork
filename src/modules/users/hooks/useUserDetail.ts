import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export function useUserDetail(userId: number) {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => usersApi.fetchById(userId),
    enabled: userId > 0,
  });
}
