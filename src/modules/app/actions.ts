import { createAction } from '@reduxjs/toolkit';

import { APP_START, SET_VIEW_MODE } from './constants';

import { ViewMode } from './types';

export const appStart = createAction(APP_START);

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
  | ReturnType<typeof setViewMode>;
