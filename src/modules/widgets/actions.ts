import { createAction } from '@reduxjs/toolkit';
import { Query } from '@keen.io/parser';

import { WidgetType } from '../../types';
import { Widget, WidgetItem, GridPosition, WidgetsPosition } from './types';

import {
  REGISTER_WIDGETS,
  CREATE_WIDGET,
  UPDATE_WIDGETS_POSITION,
  FINISH_CHART_WIDGET_CONFIGURATION,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
  SET_WIDGET_LOADING,
  SET_WIDGET_INITIALIZATION,
  SET_WIDGET_STATE,
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

export type WidgetsActions =
  | ReturnType<typeof createWidget>
  | ReturnType<typeof registerWidgets>
  | ReturnType<typeof updateWidgetsPosition>
  | ReturnType<typeof initializeWidget>
  | ReturnType<typeof initializeChartWidget>
  | ReturnType<typeof setWidgetLoading>
  | ReturnType<typeof setWidgetState>
  | ReturnType<typeof setWidgetInitialization>
  | ReturnType<typeof finishChartWidgetConfiguration>;
