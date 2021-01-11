/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChartEditorActions } from './actions';
import {
  RUN_QUERY,
  RUN_QUERY_ERROR,
  RUN_QUERY_SUCCESS,
  SET_QUERY_TYPE,
  SET_VISUALIZATION_SETTINGS,
  SET_QUERY_SETTINGS,
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
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  isOpen: false,
  isEditMode: false,
  isSavedQuery: false,
  isDirtyQuery: false,
  isQueryPerforming: false,
  hasQueryChanged: false,
  querySettings: {},
  visualization: {
    type: null,
    chartSettings: {},
    widgetSettings: {},
  },
  analysisResult: null,
  changeQueryConfirmation: false,
};

const chartEditorReducer = (
  state: ReducerState = initialState,
  action: ChartEditorActions
) => {
  switch (action.type) {
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
        isQueryPerforming: false,
      };
    case RUN_QUERY_SUCCESS:
      return {
        ...state,
        isQueryPerforming: false,
        isDirtyQuery: false,
        analysisResult: action.payload.results,
      };
    case RUN_QUERY:
      return {
        ...state,
        isQueryPerforming: true,
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
