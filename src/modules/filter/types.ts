export type ReducerState = {
  isEditorOpen: boolean;
  widgetConnections: FilterConnection[];
  eventStream: string | null;
  eventStreamSchema: Record<string, string>;
  eventStreamsPool: string[];
  targetProperty: string | null;
  schemaProcessing: {
    inProgress: boolean;
    error: boolean;
  };
};

export type FilterConnection = {
  widgetId: string;
  isConnected: boolean;
  title: string | null;
  positionIndex: number;
};
