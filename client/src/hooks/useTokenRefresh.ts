import { tokenRefresh } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

export const useTokenRefresh = () => {
  return useMutation({
    mutationFn: tokenRefresh,
  });
};
