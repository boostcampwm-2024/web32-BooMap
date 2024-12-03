import { instance } from "@/api";
import { MindMap } from "@/types/mindmap";

export function createMindmap() {
  return instance.post("/connection");
}

export function getMindMap(mindMapId: string): Promise<MindMap> {
  return instance.get(`/connection/?type=mindmap&id=${mindMapId}`);
}

export function deleteMindMap(mindMapId: string) {
  return instance.delete(`/mindmap/${mindMapId}`);
}

export async function getMindMapByConnectionId(connectionId: string): Promise<string> {
  const { data } = await instance.get(`/connection/?type=connection&id=${connectionId}`);
  return data.mindmapId;
}
