import { getUser } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getToken, removeToken } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useAuth() {
  const accessToken = getToken();
  const auth = useAuthStore();
  const { isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!(accessToken || auth.isAuthenticated),
  });
  useEffect(() => {
    if (isError) {
      removeToken();
    }
  }, [isError]);
  return { isLoading };
}
