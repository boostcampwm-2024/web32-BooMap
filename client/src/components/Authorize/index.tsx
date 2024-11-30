import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Authorize() {
  const navigate = useNavigate();
  const updateToken = useConnectionStore((state) => state.tokenRefresh);
  const refresh = useTokenRefresh();

  useEffect(() => {
    refresh.mutate(undefined, {
      onSuccess: (response) => {
        updateToken(response.accessToken);
        navigate("/");
      },
      onError: () => navigate("/error"),
    });
  }, [navigate]);

  return <p className="text-white">Authenticating</p>;
}
