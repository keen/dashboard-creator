/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChartEditorActions } from './actions';
import {
  RUN_QUERY,
  RUN_QUERY_ERROR,
  RUN_QUERY_SUCCESS,
  SET_QUERY_TYPE,
  SET_VISUALIZATION_SETTINGS,
  SET_QUERY_SETTINGS,
  SET_INITIAL_QUERY_SETTINGS,
  SET_QUERY_RESULT,
  SET_QUERY_CHANGE,
  SET_QUERY_DIRTY,
  SET_EDIT_MODE,
  RESET_EDITOR,
  OPEN_EDITOR,
  CLOSE_EDITOR,
  SHOW_QUERY_UPDATE_CONFIRMATION,
  HIDE_QUERY_UPDATE_CONFIRMATION,
  UPDATE_CHART_SETTINGS,
  UPDATE_WIDGET_SETTINGS,
  SET_EDITOR_SECTION,
} from './constants';

import { createWidgetSettings } from './utils';

import { ReducerState, EditorSection } from './types';

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

const chartEditorReducer = (
  state: ReducerState = initialState,
  action: ChartEditorActions
) => {
  switch (action.type) {
    case SET_EDITOR_SECTION:
      return {
        ...state,
        editorSection: action.payload.editorSection,
      };
    case SHOW_QUERY_UPDATE_CONFIRMATION:
      return {
        ...state,
        changeQueryConfirmation: true,
      };
    case HIDE_QUERY_UPDATE_CONFIRMATION:
      return {
        ...state,
        changeQueryConfirmation: false,
      };
    case SET_QUERY_TYPE:
      return {
        ...state,
        isSavedQuery: action.payload.isSavedQuery,
      };
    case SET_QUERY_DIRTY:
      return {
        ...state,
        isDirtyQuery: action.payload.isDirtyQuery,
      };
    case SET_QUERY_CHANGE:
      return {
        ...state,
        hasQueryChanged: action.payload.hasQueryChanged,
      };
    case SET_EDIT_MODE:
      return {
        ...state,
        isEditMode: action.payload.isEditMode,
      };
    case UPDATE_WIDGET_SETTINGS:
      return {
        ...state,
        visualization: {
          ...state.visualization,
          widgetSettings: {
            ...state.visualization.widgetSettings,
            ...action.payload.widgetSettings,
          },
        },
      };
    case UPDATE_CHART_SETTINGS:
      return {
        ...state,
        visualization: {
          ...state.visualization,
          chartSettings: {
            ...state.visualization.chartSettings,
            ...action.payload.chartSettings,
          },
        },
      };
    case SET_VISUALIZATION_SETTINGS:
      return {
        ...state,
        visualization: {
          type: action.payload.type,
          chartSettings: action.payload.chartSettings,
          widgetSettings: action.payload.widgetSettings,
        },
      };
    case RESET_EDITOR:
      const { changeQueryConfirmation, isOpen, ...editorState } = initialState;
      return {
        ...state,
        ...editorState,
      };
    case SET_QUERY_RESULT:
      return {
        ...state,
        analysisResult: action.payload.results,
      };
    case RUN_QUERY_ERROR:
      return {
        ...state,
        isDirtyQuery: false,
        queryError: action.payload,
        isQueryPerforming: false,
      };
    case RUN_QUERY_SUCCESS:
      return {
        ...state,
        isQueryPerforming: false,
        isDirtyQuery: false,
        queryError: null,
        analysisResult: action.payload.results,
      };
    case RUN_QUERY:
      return {
        ...state,
        isQueryPerforming: true,
      };
    case SET_INITIAL_QUERY_SETTINGS:
      return {
        ...state,
        initialQuerySettings: action.payload.query,
      };
    case SET_QUERY_SETTINGS:
      return {
        ...state,
        querySettings: action.payload.query,
      };
    case OPEN_EDITOR:
      return {
        ...state,
        isOpen: true,
      };
    case CLOSE_EDITOR:
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};

export default chartEditorReducer;
