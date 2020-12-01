import { createAction } from '@reduxjs/toolkit';

import {
  APP_START,
  SET_VIEW_MODE,
  SHOW_QUERY_PICKER,
  HIDE_QUERY_PICKER,
} from './constants';

import { ViewMode } from './types';

export const appStart = createAction(APP_START);

export const showQueryPicker = createAction(SHOW_QUERY_PICKER);

export const hideQueryPicker = createAction(HIDE_QUERY_PICKER);

export const setViewMode = createAction(
  SET_VIEW_MODE,
  (view: ViewMode, dashboardId?: string) => ({
    payload: {
      view,
      dashboardId,
    },
  })
);

export type AppActions =
  | ReturnType<typeof appStart>
  | ReturnType<typeof showQueryPicker>
  | ReturnType<typeof hideQueryPicker>
  | ReturnType<typeof setViewMode>;
