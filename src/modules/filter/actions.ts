import { createAction } from '@reduxjs/toolkit';

import { FilterConnection } from './types';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  APPLY_EDITOR_SETTINGS,
  SET_EDITOR_CONNECTIONS,
  UPDATE_CONNECTION,
  SET_TARGET_PROPERTY,
  SET_EVENT_STREAM,
} from './constants';

export const openEditor = createAction(OPEN_EDITOR);
export const closeEditor = createAction(CLOSE_EDITOR);
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

export const setEditorConnections = createAction(
  SET_EDITOR_CONNECTIONS,
  (widgetConnections: FilterConnection[]) => ({
    payload: {
      widgetConnections,
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

export type FilterActions =
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>
  | ReturnType<typeof applySettings>
  | ReturnType<typeof setEditorConnections>
  | ReturnType<typeof updateConnection>
  | ReturnType<typeof setTargetProperty>
  | ReturnType<typeof setEventStream>;
