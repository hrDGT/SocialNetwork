import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { authStore } from "../store/AuthStore";
import type { LoginPayload } from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user) => authStore.setUser(user),
  });
}
