import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { RegisterPayload } from "../types";

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => alert("Registration successful"),
  });
}
