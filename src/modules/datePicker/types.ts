export type ReducerState = {
  isEditorOpen: boolean;
  widgetConnections: DatePickerConnection[];
  name: string;
};

export type DatePickerConnection = {
  widgetId: string;
  isConnected: boolean;
  title: string | null;
  positionIndex: number;
};
