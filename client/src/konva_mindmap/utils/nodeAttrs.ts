const NODE_DEFAULT_SIZE = 80;
const NODE_DEFAULT_RATIO = 7;

//NODE
export const NODE_WIDTH_AND_HEIGHT = 100;
export const NODE_RADIUS = (depth: number) => NODE_DEFAULT_SIZE - depth * NODE_DEFAULT_RATIO;
export const TEXT_OFFSET_X = (depth: number) => NODE_DEFAULT_SIZE - depth * 10;
export const TEXT_OFFSET_Y = (depth: number) => 5 * depth - NODE_DEFAULT_SIZE - 5;
export const TEXT_WIDTH = (depth: number) => NODE_DEFAULT_SIZE * 2 - depth * 20;

//CONNECTED_LINE
export const CONNECTED_LINE_FROM = (depth: number) => NODE_DEFAULT_SIZE - depth * 7 + 10;
export const CONNECTED_LINE_TO = (depth: number) => NODE_DEFAULT_SIZE - depth * 7 - 20;

//TEXT
export const TEXT_FONT_SIZE = 20;
