/*eslint-disable @typescript-eslint/no-unused-vars*/
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PickerWidgets } from '@keen.io/widget-picker';
import { Query } from '@keen.io/query';

import { createWidgetSettings } from './utils';

import {
  ReducerState,
  EditorSection,
  EditorWidgetSettings,
  VisualisationSettingsPayload,
} from './types';

export const initialState: ReducerState = {
  editorSection: EditorSection.QUERY,
  isOpen: false,
  isEditMode: false,
  isSavedQuery: false,
  isDirtyQuery: false,
  isQueryPerforming: false,
  hasQueryChanged: false,
  initialQuerySettings: null,
  querySettings: {},
  queryError: null,
  visualization: {
    type: null,
    chartSettings: {},
    widgetSettings: createWidgetSettings(),
  },
  analysisResult: null,
  changeQueryConfirmation: false,
};

const chartEditorSlice = createSlice({
  name: 'chartEditor',
  initialState,
  reducers: {
    setEditorSection: (state, { payload }: PayloadAction<EditorSection>) => {
      state.editorSection = payload;
    },
    showQueryUpdateConfirmation: (state) => {
      state.changeQueryConfirmation = true;
    },
    hideQueryUpdateConfirmation: (state) => {
      state.changeQueryConfirmation = false;
    },
    setQueryType: (state, { payload }: PayloadAction<boolean>) => {
      state.isSavedQuery = payload;
    },
    setQueryDirty: (state, { payload }: PayloadAction<boolean>) => {
      state.isDirtyQuery = payload;
    },
    setQueryChange: (state, { payload }: PayloadAction<boolean>) => {
      state.hasQueryChanged = payload;
    },
    setEditMode: (state, { payload }: PayloadAction<boolean>) => {
      state.isEditMode = payload;
    },
    updateWidgetSettings: (
      state,
      { payload }: PayloadAction<Record<string, any>>
    ) => {
      state.visualization.widgetSettings = {
        ...state.visualization.widgetSettings,
        ...payload,
      };
    },
    updateChartSettings: (
      state,
      { payload }: PayloadAction<Record<string, any>>
    ) => {
      state.visualization.chartSettings = {
        ...state.visualization.chartSettings,
        ...payload,
      };
    },
    setVisualizationSettings: (
      state,
      { payload }: PayloadAction<VisualisationSettingsPayload>
    ) => {
      state.visualization.type = payload.type as Exclude<PickerWidgets, 'json'>;
      state.visualization.chartSettings = payload.chartSettings;
      state.visualization.widgetSettings = payload.widgetSettings as EditorWidgetSettings;
    },
    resetEditor: (state) => {
      const {
        changeQueryConfirmation,
        isOpen,
        ...initialEditorState
      } = initialState;
      return { ...state, ...initialEditorState };
    },
    setQueryResult: (
      state,
      { payload }: PayloadAction<Record<string, any>>
    ) => {
      state.analysisResult = payload;
    },
    runQueryError: (state, { payload }: PayloadAction<string>) => {
      (state.isQueryPerforming = false),
        (state.isDirtyQuery = false),
        (state.queryError = payload);
    },
    runQuerySuccess: (
      state,
      { payload }: PayloadAction<Record<string, any>>
    ) => {
      (state.isQueryPerforming = false),
        (state.isDirtyQuery = false),
        (state.queryError = null);
      state.analysisResult = payload;
    },
    runQuery: (state) => {
      state.isQueryPerforming = true;
    },
    setInitialQuerySettings: (
      state,
      { payload }: PayloadAction<Partial<Query>>
    ) => {
      state.initialQuerySettings = payload;
    },
    setQuerySettings: (state, { payload }: PayloadAction<Partial<Query>>) => {
      state.querySettings = payload;
    },
    openEditor: (state) => {
      state.isOpen = true;
    },
    closeEditor: (state) => {
      state.isOpen = false;
    },
  },
});

export default chartEditorSlice;
