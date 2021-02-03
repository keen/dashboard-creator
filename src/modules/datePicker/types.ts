export type ReducerState = {
  isEditorOpen: boolean;
  widgetConnections: DatePickerConnection[];
};

export type DatePickerConnection = {
  widgetId: string;
  isConnected: boolean;
};
