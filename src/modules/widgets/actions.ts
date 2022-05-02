import { createAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';
import { Timeframe } from '@keen.io/query';

export const editChartWidget = createAction(
  '@widgets/EDIT_CHART_WIDGET',
  (id: string, usePersistedChartEditorState = false) => ({
    payload: { id, usePersistedChartEditorState },
  })
);

export const editImageWidget = createAction(
  '@widgets/EDIT_IMAGE_WIDGET',
  (id: string) => ({
    payload: { id },
  })
);

export const editInlineTextWidget = createAction(
  '@widgets/EDIT_INLINE_TEXT_WIDGET',
  (id: string, content: RawDraftContentState) => ({
    payload: {
      id,
      content,
    },
  })
);

export const editTextWidget = createAction(
  '@widgets/EDIT_TEXT_WIDGET',
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const initializeChartWidget = createAction(
  '@widgets/INITIALIZE_CHART_WIDGET',
  (id: string) => ({
    payload: { id },
  })
);

export const initializeWidget = createAction(
  '@widgets/INITIALIZE_WIDGET',
  (id: string) => ({
    payload: { id },
  })
);

export const setWidgetInitialization = createAction(
  '@widgets/SET_WIDGET_INITIALIZATION',
  (id: string, isInitialized: boolean) => ({
    payload: {
      id,
      isInitialized,
    },
  })
);

export const savedQueryUpdated = createAction(
  '@widgets/SAVED_QUERY_UPDATED',
  (widgetId: string, queryId: string) => ({
    payload: {
      widgetId,
      queryId,
    },
  })
);

export const cloneWidget = createAction(
  '@widgets/CLONE_WIDGET',
  (widgetId: string) => ({
    payload: {
      widgetId,
    },
  })
);

export const saveImage = createAction(
  '@widgets/SAVE_IMAGE',
  (link: string) => ({
    payload: {
      link,
    },
  })
);

export const editDatePickerWidget = createAction(
  '@widgets/EDIT_DATE_PICKER_WIDGET',
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const applyDatePickerModifiers = createAction(
  '@widgets/APPLY_DATE_PICKER_MODIFIERS',
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const clearDatePickerModifiers = createAction(
  '@widgets/CLEAR_DATE_PICKER_MODIFIERS',
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const setDatePickerModifiers = createAction(
  '@widgets/SET_DATE_PICKER_WIDGET_MODIFIERS',
  (widgetId: string, timeframe: Timeframe, timezone: string) => ({
    payload: {
      widgetId,
      timeframe,
      timezone,
    },
  })
);

export const resetDatePickerWidgets = createAction(
  '@widgets/RESET_DATE_PICKER_WIDGETS',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const editFilterWidget = createAction(
  '@widgets/EDIT_FILTER_WIDGET',
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const setFilterWidget = createAction(
  '@widgets/SET_FILTER_WIDGET',
  (widgetId: string) => ({
    payload: {
      widgetId,
    },
  })
);

export const unapplyFilterWidget = createAction(
  '@widgets/UNAPPLY_FILTER_WIDGET',
  (filterId: string) => ({
    payload: {
      filterId,
    },
  })
);

export const applyFilterModifiers = createAction(
  '@widgets/APPLY_FILTER_MODIFIERS',
  (id: string) => ({
    payload: {
      id,
    },
  })
);

export const clearInconsistentFiltersError = createAction(
  '@widgets/CLEAR_INCONSISTENT_FILTERS_ERROR_FROM_WIDGETS',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const resetFilterWidgets = createAction(
  '@widgets/RESET_FILTER_WIDGETS',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const createNewChart = createAction(
  '@widgets/CREATE_NEW_CHART',
  (widgetId: string) => ({
    payload: {
      widgetId,
    },
  })
);
