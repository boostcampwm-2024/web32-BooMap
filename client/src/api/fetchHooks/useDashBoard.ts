import { getDashBoard } from "@/api/dashboard.api";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useDashBoard() {
  return useSuspenseQuery({ queryKey: ["dashboard"], queryFn: getDashBoard, retry: 2, refetchOnMount: true });
}
