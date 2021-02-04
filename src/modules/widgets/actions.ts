import { createAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';
import { Query, Timeframe } from '@keen.io/query';

import { WidgetType } from '../../types';
import { Widget, WidgetItem, GridPosition, WidgetsPosition } from './types';

import {
  REGISTER_WIDGETS,
  CREATE_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGETS_POSITION,
  UPDATE_CHART_WIDGET_DATE_PICKER_CONNECTION,
  FINISH_CHART_WIDGET_CONFIGURATION,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
  EDIT_CHART_WIDGET,
  EDIT_IMAGE_WIDGET,
  RESET_DATE_PICKER_WIDGETS,
  APPLY_DATE_PICKER_MODIFIERS,
  SET_DATE_PICKER_WIDGET_MODIFIERS,
  EDIT_DATE_PICKER_WIDGET,
  SET_IMAGE_WIDGET,
  SET_TEXT_WIDGET,
  EDIT_TEXT_WIDGET,
  EDIT_INLINE_TEXT_WIDGET,
  SET_DATE_PICKER_WIDGET,
  SAVE_CLONED_WIDGET,
  SET_WIDGET_LOADING,
  SET_WIDGET_INITIALIZATION,
  SET_WIDGET_STATE,
  SAVED_QUERY_UPDATED,
  CLONE_WIDGET,
  SAVE_IMAGE,
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

export const editChartWidget = createAction(
  EDIT_CHART_WIDGET,
  (id: string, usePersistedChartEditorState = false) => ({
    payload: { id, usePersistedChartEditorState },
  })
);

export const editImageWidget = createAction(
  EDIT_IMAGE_WIDGET,
  (id: string) => ({
    payload: { id },
  })
);

export const setImageWidget = createAction(
  SET_IMAGE_WIDGET,
  (id: string, link: string) => ({
    payload: {
      id,
      link,
    },
  })
);

export const setTextWidget = createAction(
  SET_TEXT_WIDGET,
  (
    id: string,
    settings: {
      content: RawDraftContentState;
      textAlignment?: 'left' | 'center' | 'right';
    }
  ) => ({
    payload: {
      id,
      settings,
    },
  })
);

export const saveClonedWidget = createAction(
  SAVE_CLONED_WIDGET,
  (id: string, widgetSettings: Widget, widgetItem: WidgetItem) => ({
    payload: {
      id,
      widgetSettings,
      widgetItem,
    },
  })
);

export const editInlineTextWidget = createAction(
  EDIT_INLINE_TEXT_WIDGET,
  (id: string, content: RawDraftContentState) => ({
    payload: {
      id,
      content,
    },
  })
);

export const editTextWidget = createAction(EDIT_TEXT_WIDGET, (id: string) => ({
  payload: {
    id,
  },
}));

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

export const savedQueryUpdated = createAction(
  SAVED_QUERY_UPDATED,
  (widgetId: string, queryId: string) => ({
    payload: {
      widgetId,
      queryId,
    },
  })
);

export const cloneWidget = createAction(CLONE_WIDGET, (widgetId: string) => ({
  payload: {
    widgetId,
  },
}));

export const saveImage = createAction(SAVE_IMAGE, (link: string) => ({
  payload: {
    link,
  },
}));

export const updateChartWidgetDatePickerConnection = createAction(
  UPDATE_CHART_WIDGET_DATE_PICKER_CONNECTION,
  (id: string, datePickerId: string | null) => ({
    payload: {
      id,
      datePickerId,
    },
  })
);

export const setDatePickerWidget = createAction(
  SET_DATE_PICKER_WIDGET,
  (id: string, widgetConnections: string[]) => ({
    payload: {
      id,
      widgetConnections,
    },
  })
);

export const editDatePickerWidget = createAction(
  EDIT_DATE_PICKER_WIDGET,
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const applyDatePickerModifiers = createAction(
  APPLY_DATE_PICKER_MODIFIERS,
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const setDatePickerModifiers = createAction(
  SET_DATE_PICKER_WIDGET_MODIFIERS,
  (widgetId: string, timeframe: Timeframe, timezone: string) => ({
    payload: {
      widgetId,
      timeframe,
      timezone,
    },
  })
);

export const resetDatePickerWidgets = createAction(
  RESET_DATE_PICKER_WIDGETS,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export type WidgetsActions =
  | ReturnType<typeof createWidget>
  | ReturnType<typeof removeWidget>
  | ReturnType<typeof registerWidgets>
  | ReturnType<typeof updateWidgetsPosition>
  | ReturnType<typeof initializeWidget>
  | ReturnType<typeof initializeChartWidget>
  | ReturnType<typeof editChartWidget>
  | ReturnType<typeof setWidgetLoading>
  | ReturnType<typeof setWidgetState>
  | ReturnType<typeof setWidgetInitialization>
  | ReturnType<typeof setTextWidget>
  | ReturnType<typeof editTextWidget>
  | ReturnType<typeof editInlineTextWidget>
  | ReturnType<typeof editDatePickerWidget>
  | ReturnType<typeof setImageWidget>
  | ReturnType<typeof setDatePickerWidget>
  | ReturnType<typeof finishChartWidgetConfiguration>
  | ReturnType<typeof updateChartWidgetDatePickerConnection>
  | ReturnType<typeof resetDatePickerWidgets>
  | ReturnType<typeof setDatePickerModifiers>
  | ReturnType<typeof applyDatePickerModifiers>
  | ReturnType<typeof savedQueryUpdated>
  | ReturnType<typeof cloneWidget>
  | ReturnType<typeof saveClonedWidget>
  | ReturnType<typeof saveImage>;
