import { createAction } from '@reduxjs/toolkit';

import { Theme } from '@keen.io/charts';
import {
  SET_BASE_THEME,
  UPDATE_BASE_THEME,
  RESET_BASE_THEME,
  UPDATE_DASHBOARD_THEME,
  REMOVE_DASHBOARD_THEME,
} from './constants';

export const setBaseTheme = createAction(
  SET_BASE_THEME,
  (theme: Partial<Theme>) => ({
    payload: {
      theme,
    },
  })
);

export const updateBaseTheme = createAction(
  UPDATE_BASE_THEME,
  (theme: Partial<Theme>) => ({
    payload: {
      theme,
    },
  })
);

export const resetBaseTheme = createAction(RESET_BASE_THEME);

export const updateDashboardTheme = createAction(
  UPDATE_DASHBOARD_THEME,
  (dashboardId: string, theme: Partial<Theme>) => ({
    payload: {
      dashboardId,
      theme,
    },
  })
);

export const removeDashboardTheme = createAction(
  REMOVE_DASHBOARD_THEME,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export type ThemeActions =
  | ReturnType<typeof setBaseTheme>
  | ReturnType<typeof updateBaseTheme>
  | ReturnType<typeof resetBaseTheme>
  | ReturnType<typeof updateDashboardTheme>
  | ReturnType<typeof removeDashboardTheme>;
