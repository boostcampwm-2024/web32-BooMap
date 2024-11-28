import { instance } from "@/api";

export function createMindmap() {
  return instance.post("/connection");
}

export function deleteMindMap(mindMapId: string) {
  return instance.delete(`/mindmap/${mindMapId}`);
}
