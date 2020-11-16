import { DashboardsActions } from './actions';

import {
  FETCH_DASHBOARDS_LIST_SUCCESS,
  REGISTER_DASHBOARD,
  UPDATE_DASHBOARD,
} from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  metadata: {
    isLoaded: false,
    error: null,
    data: [],
  },
  items: {},
};

const dashboardsReducer = (
  state: ReducerState = initialState,
  action: DashboardsActions
) => {
  switch (action.type) {
    case REGISTER_DASHBOARD:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            initialized: false,
            settings: null,
          },
        },
      };
    case UPDATE_DASHBOARD:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            initialized: true,
            settings: action.payload.settings,
          },
        },
      };
    case FETCH_DASHBOARDS_LIST_SUCCESS:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isLoaded: true,
          error: null,
          data: action.payload.dashboards,
        },
      };
    default:
      return state;
  }
};

export default dashboardsReducer;
