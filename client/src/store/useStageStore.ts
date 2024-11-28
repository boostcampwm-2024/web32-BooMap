import Konva from "konva";
import { RefObject } from "react";
import { create } from "zustand";

interface StageStore {
  stage: null | RefObject<Konva.Stage>;
  registerStageRef: (stage: RefObject<Konva.Stage>) => void;
}
export const useStageStore = create<StageStore>((set) => ({
  stage: null,
  registerStageRef: (stage) =>
    set({
      stage: stage,
    }),
}));
