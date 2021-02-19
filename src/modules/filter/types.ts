export type SchemaPropertiesList = { path: string; type: string }[];

export type ReducerState = {
  isEditorOpen: boolean;
  widgetConnections: FilterConnection[];
  detachedWidgetConnections: FilterConnection[];
  eventStream: string | null;
  eventStreamSchema: {
    schema: Record<string, string>;
    tree: Record<string, any>;
    list: SchemaPropertiesList;
  };
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
