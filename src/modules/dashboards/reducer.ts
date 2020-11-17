import { DashboardsActions } from './actions';

import {
  FETCH_DASHBOARDS_LIST_SUCCESS,
  REGISTER_DASHBOARD,
  UPDATE_DASHBOARD,
  CREATE_DASHBOARD,
  ADD_WIDGET_TO_DASHBOARD,
  REMOVE_WIDGET_FROM_DASHBOARD,
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
    case REMOVE_WIDGET_FROM_DASHBOARD:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            settings: {
              ...state.items[action.payload.dashboardId].settings,
              widgets: state.items[
                action.payload.dashboardId
              ].settings.widgets.filter((id) => id !== action.payload.widgetId),
            },
          },
        },
      };
    case ADD_WIDGET_TO_DASHBOARD:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            settings: {
              ...state.items[action.payload.dashboardId].settings,
              widgets: [
                action.payload.widgetId,
                ...state.items[action.payload.dashboardId].settings.widgets,
              ],
            },
          },
        },
      };
    case CREATE_DASHBOARD:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: [...state.metadata.data, { id: action.payload.dashboardId }],
        },
      };
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
