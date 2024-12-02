import { NodeData } from "./Node";

export type actionType =
  | "createNode"
  | "deleteNode"
  | "updateNode"
  | "updateTitle"
  | "updateContent"
  | "aiRequest"
  | "audioAiRequest";

export type HandleSocketEventPayloads =
  | createNodePayload
  | deleteNodePayload
  | updateNodePayload
  | updateContentPayload
  | updateTitlePayload
  | aiRequestPayload;

type createNodePayload = {
  id: number;
  keyword: string;
  depth: number;
  location: { x: number; y: number };
  children: number[] | [];
  newNode: boolean;
  parentId: number | null;
};

type deleteNodePayload = {
  id: string[];
};

type updateNodePayload = NodeData;

type updateTitlePayload = { title: string };
type updateContentPayload = { content: string };
type aiRequestPayload = { aiContent: string };
