import { AppActions } from './actions';

import {
  SET_ACTIVE_DASHBOARD,
  SHOW_QUERY_PICKER,
  HIDE_QUERY_PICKER,
} from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  view: 'management',
  activeDashboardId: null,
  queryPicker: {
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
