import { createAction } from '@reduxjs/toolkit';
import { Query } from '@keen.io/query';

import { WidgetType } from '../../types';
import { Widget, WidgetItem, GridPosition, WidgetsPosition } from './types';

import {
  REGISTER_WIDGETS,
  CREATE_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGETS_POSITION,
  FINISH_CHART_WIDGET_CONFIGURATION,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
  SET_WIDGET_LOADING,
  SET_WIDGET_INITIALIZATION,
  SET_WIDGET_STATE,
  CHART_WIDGET_EDITOR_RUN_QUERY,
  CHART_WIDGET_EDITOR_RUN_QUERY_SUCCESS,
  CHART_WIDGET_EDITOR_RUN_QUERY_ERROR,
  CHART_WIDGET_EDITOR_APPLY_CONFIGURATION,
  CHART_WIDGET_EDITOR_SET_QUERY_SETTINGS,
  RESET_CHART_WIDGET_EDITOR,
  OPEN_CHART_WIDGET_EDITOR,
  CLOSE_CHART_WIDGET_EDITOR,
  CHART_WIDGET_EDITOR_MOUNTED,
} from './constants';

export const registerWidgets = createAction(
  REGISTER_WIDGETS,
  (widgets: Widget[]) => ({
    payload: {
      widgets,
    },
  })
);

export const updateWidgetsPosition = createAction(
  UPDATE_WIDGETS_POSITION,
  (gridPositions: WidgetsPosition) => ({
    payload: {
      gridPositions,
    },
  })
);

export const createWidget = createAction(
  CREATE_WIDGET,
  (id: string, widgetType: WidgetType, gridPosition: GridPosition) => ({
    payload: {
      id,
      widgetType,
      gridPosition,
    },
  })
);

export const removeWidget = createAction(REMOVE_WIDGET, (id: string) => ({
  payload: {
    id,
  },
}));

export const finishChartWidgetConfiguration = createAction(
  FINISH_CHART_WIDGET_CONFIGURATION,
  (
    id: string,
    query: string | Query,
    visualizationType: string,
    chartSettings: Record<string, any>,
    widgetSettings: Record<string, any>
  ) => ({
    payload: {
      id,
      visualizationType,
      chartSettings,
      widgetSettings,
      query,
    },
  })
);

export const initializeChartWidget = createAction(
  INITIALIZE_CHART_WIDGET,
  (id: string) => ({
    payload: { id },
  })
);

export const initializeWidget = createAction(
  INITIALIZE_WIDGET,
  (id: string) => ({
    payload: { id },
  })
);

export const setWidgetInitialization = createAction(
  SET_WIDGET_INITIALIZATION,
  (id: string, isInitialized: boolean) => ({
    payload: {
      id,
      isInitialized,
    },
  })
);

export const setWidgetLoading = createAction(
  SET_WIDGET_LOADING,
  (id: string, isLoading: boolean) => ({
    payload: {
      id,
      isLoading,
    },
  })
);

export const setWidgetState = createAction(
  SET_WIDGET_STATE,
  (id: string, widgetState: Partial<Omit<WidgetItem, 'widget'>>) => ({
    payload: {
      id,
      widgetState,
    },
  })
);

export const setQuerySettings = createAction(
  CHART_WIDGET_EDITOR_SET_QUERY_SETTINGS,
  (query: Partial<Query>) => ({
    payload: {
      query,
    },
  })
);

export const resetChartWidgetEditor = createAction(RESET_CHART_WIDGET_EDITOR);

export const openChartWidgetEditor = createAction(OPEN_CHART_WIDGET_EDITOR);

export const closeChartWidgetEditor = createAction(CLOSE_CHART_WIDGET_EDITOR);

export const chartWidgetEditorMounted = createAction(
  CHART_WIDGET_EDITOR_MOUNTED
);

export const chartWidgetEditorRunQuery = createAction(
  CHART_WIDGET_EDITOR_RUN_QUERY
);

export const chartWidgetEditorRunQuerySuccess = createAction(
  CHART_WIDGET_EDITOR_RUN_QUERY_SUCCESS,
  (results: Record<string, any>) => ({
    payload: {
      results,
    },
  })
);

export const chartWidgetEditorRunQueryError = createAction(
  CHART_WIDGET_EDITOR_RUN_QUERY_ERROR
);

export const applyChartWidgetEditorConfiguration = createAction(
  CHART_WIDGET_EDITOR_APPLY_CONFIGURATION
);

export type WidgetsActions =
  | ReturnType<typeof createWidget>
  | ReturnType<typeof removeWidget>
  | ReturnType<typeof registerWidgets>
  | ReturnType<typeof updateWidgetsPosition>
  | ReturnType<typeof initializeWidget>
  | ReturnType<typeof initializeChartWidget>
  | ReturnType<typeof setWidgetLoading>
  | ReturnType<typeof setWidgetState>
  | ReturnType<typeof setWidgetInitialization>
  | ReturnType<typeof finishChartWidgetConfiguration>
  | ReturnType<typeof openChartWidgetEditor>
  | ReturnType<typeof closeChartWidgetEditor>
  | ReturnType<typeof resetChartWidgetEditor>
  | ReturnType<typeof setQuerySettings>
  | ReturnType<typeof chartWidgetEditorMounted>
  | ReturnType<typeof chartWidgetEditorRunQuery>
  | ReturnType<typeof chartWidgetEditorRunQuerySuccess>
  | ReturnType<typeof chartWidgetEditorRunQueryError>
  | ReturnType<typeof applyChartWidgetEditorConfiguration>;
