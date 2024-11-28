import { tokenRefresh } from "@/api/auth";
import Spinner from "@/components/common/Spinner";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Authorize() {
  const [searchParams] = useSearchParams();
  // const loginSuccess = searchParams.get("success");
  const navigate = useNavigate();

  const refresh = useTokenRefresh();

  useEffect(() => {
    refresh.mutate(undefined, {
      onSuccess: () => navigate("/"),
      onError: () => navigate("/error"),
    });
    // if (loginSuccess === "true") {
    // navigate("/");
    // }
  }, [navigate]);

  return <p className="text-white">Authenticating</p>;
}
