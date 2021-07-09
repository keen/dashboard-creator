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
  SET_CHART_WIDGET_VISUALIZATION,
  EDIT_CHART_WIDGET,
  EDIT_IMAGE_WIDGET,
  RESET_DATE_PICKER_WIDGETS,
  APPLY_DATE_PICKER_MODIFIERS,
  CLEAR_DATE_PICKER_MODIFIERS,
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
  CONFIGURE_FILTER_WIDGET,
  EDIT_FILTER_WIDGET,
  UPDATE_CHART_WIDGET_FILTERS_CONNECTIONS,
  SET_FILTER_WIDGET,
  SET_FILTER_PROPERTY_LIST,
  APPLY_FILTER_WIDGET,
  UNAPPLY_FILTER_WIDGET,
  APPLY_FILTER_MODIFIERS,
  CLEAR_FILTER_DATA,
  CLEAR_INCONSISTENT_FILTERS_ERROR_FROM_WIDGETS,
  UNREGISTER_WIDGET,
  RESET_FILTER_WIDGETS,
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

export const setChartWidgetVisualization = createAction(
  SET_CHART_WIDGET_VISUALIZATION,
  (
    id: string,
    visualizationType: string,
    chartSettings: Record<string, any>,
    widgetSettings: Record<string, any>
  ) => ({
    payload: {
      id,
      visualizationType,
      chartSettings,
      widgetSettings,
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

export const unregisterWidget = createAction(
  UNREGISTER_WIDGET,
  (widgetId: string) => ({
    payload: {
      widgetId,
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
  (id: string, widgetConnections: string[], name: string) => ({
    payload: {
      id,
      widgetConnections,
      name,
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

export const clearDatePickerModifiers = createAction(
  CLEAR_DATE_PICKER_MODIFIERS,
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

export const configureFilerWidget = createAction(
  CONFIGURE_FILTER_WIDGET,
  (
    id: string,
    widgetConnections: string[],
    eventStream: string,
    targetProperty: string,
    name?: string
  ) => ({
    payload: {
      id,
      widgetConnections,
      eventStream,
      targetProperty,
      name,
    },
  })
);

export const editFilterWidget = createAction(
  EDIT_FILTER_WIDGET,
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const updateChartWidgetFiltersConnections = createAction(
  UPDATE_CHART_WIDGET_FILTERS_CONNECTIONS,
  (id: string, filterIds: string[]) => ({
    payload: {
      id,
      filterIds,
    },
  })
);

export const setFilterWidget = createAction(
  SET_FILTER_WIDGET,
  (widgetId: string) => ({
    payload: {
      widgetId,
    },
  })
);

export const setFilterPropertyList = createAction(
  SET_FILTER_PROPERTY_LIST,
  (filterId: string, propertyList: string[]) => ({
    payload: {
      filterId,
      propertyList,
    },
  })
);

export const applyFilterWidget = createAction(
  APPLY_FILTER_WIDGET,
  (filterId: string, propertyValue: string[]) => ({
    payload: {
      filterId,
      propertyValue,
    },
  })
);

export const unapplyFilterWidget = createAction(
  UNAPPLY_FILTER_WIDGET,
  (filterId: string) => ({
    payload: {
      filterId,
    },
  })
);

export const applyFilterModifiers = createAction(
  APPLY_FILTER_MODIFIERS,
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const clearFilterData = createAction(
  CLEAR_FILTER_DATA,
  (filterId: string) => ({
    payload: {
      filterId,
    },
  })
);

export const clearInconsistentFiltersError = createAction(
  CLEAR_INCONSISTENT_FILTERS_ERROR_FROM_WIDGETS,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const resetFilterWidgets = createAction(
  RESET_FILTER_WIDGETS,
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
  | ReturnType<typeof clearDatePickerModifiers>
  | ReturnType<typeof savedQueryUpdated>
  | ReturnType<typeof cloneWidget>
  | ReturnType<typeof saveClonedWidget>
  | ReturnType<typeof saveImage>
  | ReturnType<typeof configureFilerWidget>
  | ReturnType<typeof editDatePickerWidget>
  | ReturnType<typeof updateChartWidgetFiltersConnections>
  | ReturnType<typeof setFilterWidget>
  | ReturnType<typeof setFilterPropertyList>
  | ReturnType<typeof applyFilterWidget>
  | ReturnType<typeof unapplyFilterWidget>
  | ReturnType<typeof applyFilterModifiers>
  | ReturnType<typeof clearFilterData>
  | ReturnType<typeof clearInconsistentFiltersError>
  | ReturnType<typeof saveImage>
  | ReturnType<typeof unregisterWidget>
  | ReturnType<typeof resetFilterWidgets>
  | ReturnType<typeof setChartWidgetVisualization>;
