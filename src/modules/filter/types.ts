export type ReducerState = {
  isEditorOpen: boolean;
  widgetConnections: FilterConnection[];
  eventStream: string;
  targetProperty: string;
};

export type FilterConnection = {
  widgetId: string;
  isConnected: boolean;
  title: string | null;
  positionIndex: number;
};
