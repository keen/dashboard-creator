/* eslint-disable @typescript-eslint/no-unused-vars */
import { ThemeActions } from './actions';

import {
  SET_BASE_THEME,
  SET_DASHBOARD_THEME,
  REMOVE_DASHBOARD_THEME,
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  base: {},
  dashboards: {},
};

const themeReducer = (
  state: ReducerState = initialState,
  action: ThemeActions
) => {
  switch (action.type) {
    case SET_BASE_THEME:
      return {
        ...state,
        base: action.payload.theme,
      };
    case SET_DASHBOARD_THEME:
      return {
        ...state,
        dashboards: {
          ...state.dashboards,
          [action.payload.dashboardId]: action.payload.theme,
        },
      };
    case REMOVE_DASHBOARD_THEME:
      const {
        [action.payload.dashboardId]: _value,
        ...dashboards
      } = state.dashboards;
      return {
        ...state,
        dashboards,
      };
    default:
      return state;
  }
};

export default themeReducer;
