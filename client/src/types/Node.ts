export type Node = {
  content: string;
  location: { x: number; y: number };
  children: Node[] | [];
};
