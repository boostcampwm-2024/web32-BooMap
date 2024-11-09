export type Node = {
  id: number;
  keyword: string;
  depth: number;
  location: {
    x: number;
    y: number;
  };
  children: number[];
};

export type NodeData = Record<number, Node>;