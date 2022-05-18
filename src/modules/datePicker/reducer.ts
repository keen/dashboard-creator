import { DatePickerConnection, ReducerState } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState: ReducerState = {
  isEditorOpen: false,
  widgetConnections: [],
  name: '',
};

const datePickerSlice = createSlice({
  name: 'datePicker',
  initialState,
  reducers: {
    openEditor: (state) => {
      state.isEditorOpen = true;
    },
    closeEditor: (state) => {
      state.name = '';
      state.widgetConnections = [];
      state.isEditorOpen = false;
    },
    setName: (state, { payload }: PayloadAction<{ name: string }>) => {
      state.name = payload.name;
    },
    setEditorConnections: (
      state,
      { payload }: PayloadAction<{ widgetConnections: DatePickerConnection[] }>
    ) => {
      state.widgetConnections = payload.widgetConnections;
    },
    updateConnection: (
      state,
      { payload }: PayloadAction<{ widgetId: string; isConnected: boolean }>
    ) => {
      state.widgetConnections = state.widgetConnections.map(
        (widgetConnection) => {
          const { widgetId } = widgetConnection;
          if (widgetId === payload.widgetId) {
            return {
              ...widgetConnection,
              isConnected: payload.isConnected,
            };
          }
          return widgetConnection;
        }
      );
    },
  },
});

export default datePickerSlice;
