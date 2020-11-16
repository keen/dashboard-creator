import { AppActions } from './actions';

import { SET_VIEW_MODE } from './constants';

import { ReducerState } from './types';

const initialState: ReducerState = {
  view: 'management',
  activeDashboardId: null,
};

const appReducer = (state: ReducerState = initialState, action: AppActions) => {
  switch (action.type) {
    case SET_VIEW_MODE:
      return {
        ...state,
        view: action.payload.view,
        activeDashboardId: action.payload.dashboardId,
      };
    default:
      return state;
  }
};

export default appReducer;
