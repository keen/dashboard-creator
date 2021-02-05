import { createAction } from '@reduxjs/toolkit';

import { DatePickerConnection } from './types';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  APPLY_EDITOR_SETTINGS,
  SET_EDITOR_CONNECTIONS,
  UPDATE_CONNECTION,
} from './constants';

export const openEditor = createAction(OPEN_EDITOR);

export const closeEditor = createAction(CLOSE_EDITOR);

export const applySettings = createAction(APPLY_EDITOR_SETTINGS);

export const setEditorConnections = createAction(
  SET_EDITOR_CONNECTIONS,
  (widgetConnections: DatePickerConnection[]) => ({
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

export type DatePickerActions =
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>
  | ReturnType<typeof applySettings>
  | ReturnType<typeof setEditorConnections>
  | ReturnType<typeof updateConnection>;
