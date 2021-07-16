import { createAction } from '@reduxjs/toolkit';

import { FilterConnection, SchemaPropertiesList } from './types';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  RESET_EDITOR,
  APPLY_EDITOR_SETTINGS,
  SET_EDITOR_CONNECTIONS,
  SET_EDITOR_DETACHED_CONNECTIONS,
  UPDATE_CONNECTION,
  SET_TARGET_PROPERTY,
  SET_EVENT_STREAM,
  SET_EVENT_STREAM_SCHEMA,
  SET_EVENT_STREAMS_POOL,
  SETUP_DASHBOARD_EVENT_STREAMS,
  SET_SCHEMA_PROCESSING,
  SET_SCHEMA_PROCESSING_ERROR,
  SET_NAME,
} from './constants';

export const openEditor = createAction(OPEN_EDITOR);
export const closeEditor = createAction(CLOSE_EDITOR);
export const resetEditor = createAction(RESET_EDITOR);
export const applySettings = createAction(APPLY_EDITOR_SETTINGS);

export const setTargetProperty = createAction(
  SET_TARGET_PROPERTY,
  (targetProperty: string) => ({
    payload: {
      targetProperty,
    },
  })
);

export const setEventStream = createAction(
  SET_EVENT_STREAM,
  (eventStream: string) => ({
    payload: {
      eventStream,
    },
  })
);

export const setName = createAction(SET_NAME, (name: string) => ({
  payload: {
    name,
  },
}));

export const setEditorConnections = createAction(
  SET_EDITOR_CONNECTIONS,
  (widgetConnections: FilterConnection[]) => ({
    payload: {
      widgetConnections,
    },
  })
);

export const setEditorDetachedConnections = createAction(
  SET_EDITOR_DETACHED_CONNECTIONS,
  (detachedWidgetConnections: FilterConnection[]) => ({
    payload: {
      detachedWidgetConnections,
    },
  })
);

export const updateConnection = createAction(
  UPDATE_CONNECTION,
  (widgetId: string, isConnected: boolean) => ({
    payload: {
      widgetId,
      isConnected,
    },
  })
);

export const setupDashboardEventStreams = createAction(
  SETUP_DASHBOARD_EVENT_STREAMS,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const setEventStreamSchema = createAction(
  SET_EVENT_STREAM_SCHEMA,
  (
    schema: Record<string, string>,
    schemaTree: Record<string, any>,
    schemaList: SchemaPropertiesList
  ) => ({
    payload: {
      schema,
      schemaTree,
      schemaList,
    },
  })
);

export const setEventStreamsPool = createAction(
  SET_EVENT_STREAMS_POOL,
  (eventStreams: string[]) => ({
    payload: {
      eventStreams,
    },
  })
);

export const setSchemaProcessing = createAction(
  SET_SCHEMA_PROCESSING,
  (isProcessingSchema: boolean) => ({
    payload: {
      isProcessingSchema,
    },
  })
);

export const setSchemaProcessingError = createAction(
  SET_SCHEMA_PROCESSING_ERROR,
  (processingError: boolean) => ({
    payload: {
      processingError,
    },
  })
);

export type FilterActions =
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>
  | ReturnType<typeof resetEditor>
  | ReturnType<typeof applySettings>
  | ReturnType<typeof setEditorDetachedConnections>
  | ReturnType<typeof setEditorConnections>
  | ReturnType<typeof updateConnection>
  | ReturnType<typeof setTargetProperty>
  | ReturnType<typeof setEventStream>
  | ReturnType<typeof setEventStreamSchema>
  | ReturnType<typeof setEventStreamsPool>
  | ReturnType<typeof setupDashboardEventStreams>
  | ReturnType<typeof setSchemaProcessingError>
  | ReturnType<typeof setSchemaProcessing>
  | ReturnType<typeof setName>;
