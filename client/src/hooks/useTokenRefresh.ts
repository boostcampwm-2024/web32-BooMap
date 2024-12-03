import { tokenRefresh } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useTokenRefresh = () => {
  return useMutation({
    mutationFn: tokenRefresh,
  });
};
