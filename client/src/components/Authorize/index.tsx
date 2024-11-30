import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Authorize() {
  const navigate = useNavigate();

  const refresh = useTokenRefresh();

  useEffect(() => {
    refresh.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () => navigate("/error"),
    });
  }, [navigate]);

  return <p className="text-white">Authenticating</p>;
}
