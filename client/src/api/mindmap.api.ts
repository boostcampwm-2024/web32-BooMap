import { instance } from "@/api";
import { MindMap } from "@/types/mindmap";

export function createMindmap() {
  return instance.post("/connection");
}

export function getMindMap(mindMapId: string): Promise<MindMap> {
  return instance.get(`/connection/${mindMapId}`);
}

export function deleteMindMap(mindMapId: string) {
  return instance.delete(`/mindmap/${mindMapId}`);
}
