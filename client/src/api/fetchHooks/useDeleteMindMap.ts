import { deleteMindMap } from "@/api/mindmap.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMindMap({ mindMapId, onError }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteMindMap(mindMapId),
    mutationKey: ["dashboard"],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    onError,
  });
}
