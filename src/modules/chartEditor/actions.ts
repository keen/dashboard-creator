import { createAction } from '@reduxjs/toolkit';
import { Query } from '@keen.io/query';
import {
  PickerWidgets,
  ChartSettings,
  WidgetSettings,
} from '@keen.io/widget-picker';

import {
  RUN_QUERY,
  RUN_QUERY_ERROR,
  RUN_QUERY_SUCCESS,
  EDITOR_MOUNTED,
  SET_VISUALIZATION_SETTINGS,
  SET_QUERY_SETTINGS,
  APPLY_CONFIGURATION,
  RESET_EDITOR,
  OPEN_EDITOR,
  CLOSE_EDITOR,
} from './constants';

export const setQuerySettings = createAction(
  SET_QUERY_SETTINGS,
  (query: Partial<Query>) => ({
    payload: {
      query,
    },
  })
);

export const setVisualizationSettings = createAction(
  SET_VISUALIZATION_SETTINGS,
  (
    type: PickerWidgets,
    chartSettings: ChartSettings,
    widgetSettings: WidgetSettings
  ) => ({
    payload: {
      type,
      chartSettings,
      widgetSettings,
    },
  })
);

export const resetEditor = createAction(RESET_EDITOR);

export const openEditor = createAction(OPEN_EDITOR);

export const closeEditor = createAction(CLOSE_EDITOR);

export const editorMounted = createAction(EDITOR_MOUNTED);

export const runQuery = createAction(RUN_QUERY);

export const runQuerySuccess = createAction(
  RUN_QUERY_SUCCESS,
  (results: Record<string, any>) => ({
    payload: {
      results,
    },
  })
);

export const runQueryError = createAction(RUN_QUERY_ERROR);

export const applyConfiguration = createAction(APPLY_CONFIGURATION);

export type ChartEditorActions =
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>
  | ReturnType<typeof resetEditor>
  | ReturnType<typeof setQuerySettings>
  | ReturnType<typeof setVisualizationSettings>
  | ReturnType<typeof editorMounted>
  | ReturnType<typeof runQuery>
  | ReturnType<typeof runQuerySuccess>
  | ReturnType<typeof runQueryError>
  | ReturnType<typeof applyConfiguration>;
