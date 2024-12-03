import { instance } from "@/api";
import { MindMap } from "@/types/mindmap";

export function createMindmap() {
  return instance.post("/connection");
}

export function getMindMap(mindMapId: string): Promise<MindMap> {
  return instance.get(`/connection/m/${mindMapId}`);
}

export function deleteMindMap(mindMapId: string) {
  return instance.delete(`/mindmap/${mindMapId}`);
}

export async function getMindMapByConnectionId(connectionId: string): Promise<string> {
  const { data } = await instance.get(`/connection/c/${connectionId}`);
  return data.mindmapId;
}
