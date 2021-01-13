import { createAction } from '@reduxjs/toolkit';
import { Theme } from '@keen.io/charts';

import {
  APP_START,
  SET_ACTIVE_DASHBOARD,
  SHOW_QUERY_PICKER,
  HIDE_QUERY_PICKER,
  SHOW_IMAGE_PICKER,
  HIDE_IMAGE_PICKER,
} from './constants';

export const appStart = createAction(
  APP_START,
  (baseTheme: Partial<Theme>) => ({
    payload: {
      baseTheme,
    },
  })
);

export const showQueryPicker = createAction(SHOW_QUERY_PICKER);

export const hideQueryPicker = createAction(HIDE_QUERY_PICKER);

export const showImagePicker = createAction(SHOW_IMAGE_PICKER);

export const hideImagePicker = createAction(HIDE_IMAGE_PICKER);

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
  | ReturnType<typeof showImagePicker>
  | ReturnType<typeof hideImagePicker>
  | ReturnType<typeof setActiveDashboard>;
