import { getUser } from "@/api/auth";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const isAuthenticated = useConnectionStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const { isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isError) {
      navigate("/error");
    }
  }, [isError]);
  return { isLoading };
}
