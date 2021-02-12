export type ReducerState = {
  isEditorOpen: boolean;
  widgetConnections: DatePickerConnection[];
};

export type DatePickerConnection = {
  widgetId: string;
  isConnected: boolean;
  title: string | null;
  positionIndex: number;
};
