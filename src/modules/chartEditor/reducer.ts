/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChartEditorActions } from './actions';
import {
  RUN_QUERY,
  RUN_QUERY_ERROR,
  RUN_QUERY_SUCCESS,
  SET_VISUALIZATION_SETTINGS,
  SET_QUERY_SETTINGS,
  RESET_EDITOR,
  OPEN_EDITOR,
  CLOSE_EDITOR,
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  isOpen: false,
  isQueryPerforming: false,
  querySettings: {},
  visualization: {
    type: null,
    chartSettings: {},
    widgetSettings: {},
  },
  analysisResult: null,
};

const chartEditorReducer = (
  state: ReducerState = initialState,
  action: ChartEditorActions
) => {
  switch (action.type) {
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
      return initialState;
    case RUN_QUERY_ERROR:
      return {
        ...state,
        isQueryPerforming: false,
      };
    case RUN_QUERY_SUCCESS:
      return {
        ...state,
        isQueryPerforming: false,
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
