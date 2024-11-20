import { tokenRefresh } from "@/api/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Authorize() {
  const [searchParams] = useSearchParams();
  const loginSuccess = searchParams.get("success");
  const navigate = useNavigate();

  useSuspenseQuery({
    queryKey: ["auth"],
    queryFn: tokenRefresh,
    retry: 2,
  });

  useEffect(() => {
    if (loginSuccess === "true") {
      navigate("/");
    }
  }, [loginSuccess, navigate]);

  return <p className="text-white">Authenticated</p>;
}
