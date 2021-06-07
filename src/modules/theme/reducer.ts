/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@keen.io/charts';

import { ReducerState, ThemeSettings, ThemeEditorSection } from './types';

import { DashboardSettings } from '../dashboards';

export const initialState: ReducerState = {
  dashboards: {},
  defaultTheme: {},
  initialTheme: {},
  currentEditTheme: {},
  editorSection: ThemeEditorSection.Main,
  modal: {
    inPreviewMode: false,
    isOpen: false,
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setEditorSection: (
      state,
      { payload }: PayloadAction<ThemeEditorSection>
    ) => {
      state.editorSection = payload;
    },
    setModalVisibility: (
      state,
      { payload }: PayloadAction<{ isOpen: boolean; inPreviewMode: boolean }>
    ) => {
      state.modal.isOpen = payload.isOpen;
      state.modal.inPreviewMode = payload.inPreviewMode;
    },
    setInitialDashboardTheme: (
      state,
      { payload }: PayloadAction<ThemeSettings>
    ) => {
      state.initialTheme = payload;
    },
    setCurrentEditTheme: (state, { payload }: PayloadAction<ThemeSettings>) => {
      state.currentEditTheme = payload;
    },
    setBaseTheme: (state, { payload }: PayloadAction<Partial<Theme>>) => {
      state.defaultTheme = payload;
    },
    setDashboardTheme: (
      state,
      {
        payload,
      }: PayloadAction<{
        dashboardId: string;
        theme: Partial<Theme>;
        settings: DashboardSettings;
      }>
    ) => {
      const { dashboardId, settings, theme } = payload;
      state.dashboards[dashboardId] = {
        theme: theme,
        settings: settings,
      };
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
