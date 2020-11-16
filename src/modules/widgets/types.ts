export type GridPosition = { w: number; h: number; x: number; y: number };

export type WidgetsPosition = (GridPosition & { i: string })[];

export type Widget = {
  id: string;
  position: GridPosition;
};

export type WidgetItem = {
  settings: Widget;
  isQueryPerforming: boolean;
};

export type ReducerState = {
  items: Record<string, WidgetItem>;
};
