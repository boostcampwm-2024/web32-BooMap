const NODE_DEFAULT_SIZE = 80;
const NODE_DEFAULT_RATIO = 7;

//NODE
export const NODE_WIDTH_AND_HEIGHT = 100;
export const NODE_RADIUS = (depth: number) => NODE_DEFAULT_SIZE - depth * NODE_DEFAULT_RATIO;
export const TEXT_OFFSET_X = (depth: number) => NODE_DEFAULT_SIZE - depth * 10;
export const TEXT_OFFSET_Y = (depth: number) => 5 * depth - NODE_DEFAULT_SIZE - 5;
export const TEXT_WIDTH = (depth: number) => NODE_DEFAULT_SIZE * 2 - depth * 18;

//CONNECTED_LINE
export const CONNECTED_LINE_FROM = (depth: number) => NODE_DEFAULT_SIZE - depth * 7 + 10;
export const CONNECTED_LINE_TO = (depth: number) => NODE_DEFAULT_SIZE - depth * 7 + 3;

//TEXT
export const TEXT_FONT_SIZE = 16;

export const TOOL_OFFSET_X = NODE_DEFAULT_SIZE - 30;
export const TOOL_OFFSET_Y = (radius: number) => NODE_DEFAULT_SIZE + radius - 20;
