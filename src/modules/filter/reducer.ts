import { FilterConnection, ReducerState, SchemaPropertiesList } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState: ReducerState = {
  isEditorOpen: false,
  schemaProcessing: {
    error: false,
    inProgress: false,
  },
  widgetConnections: [],
  detachedWidgetConnections: [],
  eventStreamsPool: [],
  eventStream: null,
  name: '',
  eventStreamSchema: {
    schema: {},
    tree: {},
    list: [],
  },
  targetProperty: null,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    resetEditor: (state) => {
      state = initialState;
      return state;
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
    setEditorDetachedConnections: (
      state,
      { payload }: PayloadAction<FilterConnection[]>
    ) => {
      state.detachedWidgetConnections = payload;
    },
    setEditorConnections: (
      state,
      { payload }: PayloadAction<FilterConnection[]>
    ) => {
      state.widgetConnections = payload;
    },
    openEditor: (state) => {
      state.isEditorOpen = true;
    },
    closeEditor: (state) => {
      state.isEditorOpen = false;
    },
    setEventStream: (state, { payload }: PayloadAction<string>) => {
      state.eventStream = payload;
    },
    setTargetProperty: (state, { payload }: PayloadAction<string>) => {
      state.targetProperty = payload;
    },
    setName: (state, { payload }: PayloadAction<string>) => {
      state.name = payload;
    },
    setEventStreamSchema: (
      state,
      {
        payload,
      }: PayloadAction<{
        schema: Record<string, string>;
        schemaTree: Record<string, any>;
        schemaList: SchemaPropertiesList;
      }>
    ) => {
      state.eventStreamSchema = {
        schema: payload.schema,
        tree: payload.schemaTree,
        list: payload.schemaList,
      };
    },
    setEventStreamsPool: (state, { payload }: PayloadAction<string[]>) => {
      state.eventStreamsPool = payload;
    },
    setSchemaProcessingError: (state, { payload }: PayloadAction<boolean>) => {
      state.schemaProcessing.error = payload;
    },
    setSchemaProcessing: (state, { payload }: PayloadAction<boolean>) => {
      state.schemaProcessing.inProgress = payload;
    },
  },
});

export default filterSlice;
