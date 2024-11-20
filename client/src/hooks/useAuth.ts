import { getUser } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getToken } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";

export default function useAuth() {
  const accessToken = getToken();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { isLoading } = useQuery({ queryKey: ["user"], queryFn: getUser, enabled: !!(accessToken || isAuthenticated) });
  return { isLoading };
}
