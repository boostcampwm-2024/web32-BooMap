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

  const { isPending } = useTokenRefresh();

  useEffect(() => {
    // if (loginSuccess === "true") {
    navigate("/");
    // }
  }, [navigate]);

  if (isPending) return <Spinner />;
  return <p className="text-white">Authenticated</p>;
}
