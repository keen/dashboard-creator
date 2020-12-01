import { createAction } from '@reduxjs/toolkit';

import {
  APP_START,
  SET_ACTIVE_DASHBOARD,
  SHOW_QUERY_PICKER,
  HIDE_QUERY_PICKER,
} from './constants';

export const appStart = createAction(APP_START);

export const showQueryPicker = createAction(SHOW_QUERY_PICKER);

export const hideQueryPicker = createAction(HIDE_QUERY_PICKER);

export const setActiveDashboard = createAction(
  SET_ACTIVE_DASHBOARD,
  (dashboardId?: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export type AppActions =
  | ReturnType<typeof appStart>
  | ReturnType<typeof showQueryPicker>
  | ReturnType<typeof hideQueryPicker>
  | ReturnType<typeof setActiveDashboard>;
