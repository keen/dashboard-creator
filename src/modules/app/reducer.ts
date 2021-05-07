import { AppStartPayload, ReducerState } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState: ReducerState = {
  view: 'management',
  activeDashboardId: null,
  cachedDashboardsNumber: null,
  user: {
    editPrivileges: false,
  },
  imagePicker: {
    isVisible: false,
  },
  visualizationEditor: {
    isVisible: false,
  },
  queryPicker: {
    isVisible: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appStart: (state, { payload }: PayloadAction<AppStartPayload>) => {
      state.cachedDashboardsNumber = payload.cachedDashboardsNumber;
      state.user.editPrivileges = payload.editPrivileges;
    },
    hideQueryPicker: (state) => {
      state.queryPicker.isVisible = false;
    },
    showQueryPicker: (state) => {
      state.queryPicker.isVisible = true;
    },
    hideImagePicker: (state) => {
      state.imagePicker.isVisible = false;
    },
    showImagePicker: (state) => {
      state.imagePicker.isVisible = true;
    },
    setActiveDashboard: (state, { payload }: PayloadAction<string>) => {
      state.activeDashboardId = payload;
    },
  },
});
export default appSlice;
