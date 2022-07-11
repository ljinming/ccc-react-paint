export interface StrawState {
  strawFlag: boolean;
  strawColor: string;
}

export interface ToolState {
  select: string;
}

export interface PaintState {
  straw: StrawState;
  tool: ToolState;
}

export interface RootState {
  paint: PaintState;
}
