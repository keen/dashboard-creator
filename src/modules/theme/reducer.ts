/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@keen.io/charts';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  dashboards: {},
  defaultTheme: {},
  initialTheme: {},
  currentEditTheme: {},
  modal: {
    inPreviewMode: false,
    isOpen: false,
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setModalVisibility: (
      state,
      { payload }: PayloadAction<{ isOpen: boolean; inPreviewMode: boolean }>
    ) => {
      state.modal.isOpen = payload.isOpen;
      state.modal.inPreviewMode = payload.inPreviewMode;
    },
    setInitialDashboardTheme: (
      state,
      { payload }: PayloadAction<Partial<Theme>>
    ) => {
      state.initialTheme = payload;
    },
    setCurrentEditTheme: (
      state,
      { payload }: PayloadAction<Partial<Theme>>
    ) => {
      state.currentEditTheme = payload;
    },
    setBaseTheme: (state, { payload }: PayloadAction<Partial<Theme>>) => {
      state.defaultTheme = payload;
    },
    setDashboardTheme: (
      state,
      { payload }: PayloadAction<{ dashboardId: string; theme: Partial<Theme> }>
    ) => {
      const { dashboardId, theme } = payload;
      state.dashboards[dashboardId] = theme;
    },
    resetDashboardEdit: (state) => {
      state.initialTheme = {};
      state.currentEditTheme = {};
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
