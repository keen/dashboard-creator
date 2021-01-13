import { AppActions } from './actions';

import {
  HIDE_QUERY_PICKER,
  SET_ACTIVE_DASHBOARD,
  SHOW_IMAGE_PICKER,
  HIDE_IMAGE_PICKER,
  SHOW_QUERY_PICKER,
} from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  view: 'management',
  activeDashboardId: null,
  queryPicker: {
    isVisible: false,
  },
  imagePicker: {
    isVisible: false,
  },
  visualizationEditor: {
    isVisible: false,
  },
};

const appReducer = (state: ReducerState = initialState, action: AppActions) => {
  switch (action.type) {
    case HIDE_QUERY_PICKER:
      return {
        ...state,
        queryPicker: {
          ...state.queryPicker,
          isVisible: false,
        },
      };
    case SHOW_QUERY_PICKER:
      return {
        ...state,
        queryPicker: {
          ...state.queryPicker,
          isVisible: true,
        },
      };
    case SHOW_IMAGE_PICKER:
      return {
        ...state,
        imagePicker: {
          ...state.imagePicker,
          isVisible: true,
        },
      };
    case HIDE_IMAGE_PICKER:
      return {
        ...state,
        imagePicker: {
          ...state.imagePicker,
          isVisible: false,
        },
      };
    case SET_ACTIVE_DASHBOARD:
      return {
        ...state,
        activeDashboardId: action.payload.dashboardId,
      };
    default:
      return state;
  }
};

export default appReducer;
