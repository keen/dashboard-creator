import deepmerge from 'deepmerge';
import { ThemeActions } from './actions';

import {
  SET_BASE_THEME,
  UPDATE_BASE_THEME,
  RESET_BASE_THEME,
  UPDATE_DASHBOARD_THEME,
  REMOVE_DASHBOARD_THEME,
} from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  base: {},
  dashboards: [],
};

const themeReducer = (
  state: ReducerState = initialState,
  action: ThemeActions
) => {
  switch (action.type) {
    case SET_BASE_THEME:
      return {
        ...state,
        base: {
          ...action.payload.theme,
        },
      };
    case UPDATE_BASE_THEME:
      return {
        ...state,
        base: deepmerge(state.base, action.payload.theme),
      };
    case RESET_BASE_THEME:
      return {
        ...state,
        base: {},
      };
    case UPDATE_DASHBOARD_THEME:
      return {
        ...state,
        dashboards: {
          ...state.dashboards,
          [action.payload.dashboardId]: action.payload.theme,
        },
      };
    case REMOVE_DASHBOARD_THEME:
      return {
        ...state,
        dashboards: state.dashboards.filter(
          (dashboard) => !dashboard[action.payload.dashboardId]
        ),
      };
    default:
      return state;
  }
};

export default themeReducer;
