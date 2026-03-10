import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { authStore } from "../store/AuthStore";
import type { RegisterPayload } from "../types";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (user) => authStore.setUser(user),
  });
}
