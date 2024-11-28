import { getUser } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getToken } from "@/utils/localstorage";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const accessToken = getToken();
  const auth = useAuthStore();
  const navigate = useNavigate();

  const { isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!(accessToken || auth.isAuthenticated),
  });

  useEffect(() => {
    if (isError) {
      navigate("/error");
    }
  }, [isError]);
  return { isLoading, accessToken };
}
