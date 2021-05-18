/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@keen.io/charts';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  base: {},
  dashboards: {},
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setBaseTheme: (state, { payload }: PayloadAction<Partial<Theme>>) => {
      state.base = payload;
    },
    setDashboardTheme: (
      state,
      { payload }: PayloadAction<{ dashboardId: string; theme: Partial<Theme> }>
    ) => {
      const { dashboardId, theme } = payload;
      state.dashboards[dashboardId] = theme;
    },
    removeDashboardTheme: (
      state,
      { payload }: PayloadAction<{ dashboardId: string }>
    ) => {
      const { dashboardId } = payload;
      const { [dashboardId]: _value, ...dashboards } = state.dashboards;

      state.dashboards = dashboards;
    },
  },
});

export default themeSlice;
