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
  SET_EDIT_MODE,
  SET_QUERY_TYPE,
  SET_QUERY_CHANGE,
  SET_VISUALIZATION_SETTINGS,
  SET_QUERY_SETTINGS,
  APPLY_CONFIGURATION,
  RESET_EDITOR,
  OPEN_EDITOR,
  CLOSE_EDITOR,
  SET_QUERY_RESULT,
  SHOW_QUERY_UPDATE_CONFIRMATION,
  HIDE_QUERY_UPDATE_CONFIRMATION,
  CONFIRM_SAVE_QUERY_UPDATE,
  USE_QUERY_FOR_WIDGET,
  UPDATE_CHART_SETTINGS,
} from './constants';

export const setQuerySettings = createAction(
  SET_QUERY_SETTINGS,
  (query: Partial<Query>) => ({
    payload: {
      query,
    },
  })
);

export const setQueryType = createAction(
  SET_QUERY_TYPE,
  (isSavedQuery: boolean) => ({
    payload: {
      isSavedQuery,
    },
  })
);

export const setQueryChange = createAction(
  SET_QUERY_CHANGE,
  (hasQueryChanged: boolean) => ({
    payload: {
      hasQueryChanged,
    },
  })
);

export const setQueryResult = createAction(
  SET_QUERY_RESULT,
  (results: Record<string, any>) => ({
    payload: {
      results,
    },
  })
);

export const setEditMode = createAction(
  SET_EDIT_MODE,
  (isEditMode: boolean) => ({
    payload: {
      isEditMode,
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

export const showQueryUpdateConfirmation = createAction(
  SHOW_QUERY_UPDATE_CONFIRMATION
);

export const hideQueryUpdateConfirmation = createAction(
  HIDE_QUERY_UPDATE_CONFIRMATION
);

export const confirmSaveQueryUpdate = createAction(CONFIRM_SAVE_QUERY_UPDATE);

export const useQueryForWidget = createAction(USE_QUERY_FOR_WIDGET);

export const updateChartSettings = createAction(
  UPDATE_CHART_SETTINGS,
  (chartSettings: Record<string, any>) => ({
    payload: {
      chartSettings,
    },
  })
);

export type ChartEditorActions =
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>
  | ReturnType<typeof resetEditor>
  | ReturnType<typeof setQueryType>
  | ReturnType<typeof setQueryResult>
  | ReturnType<typeof setQueryChange>
  | ReturnType<typeof setQuerySettings>
  | ReturnType<typeof setEditMode>
  | ReturnType<typeof setVisualizationSettings>
  | ReturnType<typeof editorMounted>
  | ReturnType<typeof runQuery>
  | ReturnType<typeof runQuerySuccess>
  | ReturnType<typeof runQueryError>
  | ReturnType<typeof applyConfiguration>
  | ReturnType<typeof showQueryUpdateConfirmation>
  | ReturnType<typeof hideQueryUpdateConfirmation>
  | ReturnType<typeof confirmSaveQueryUpdate>
  | ReturnType<typeof useQueryForWidget>
  | ReturnType<typeof updateChartSettings>;
