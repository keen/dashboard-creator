import { DashboardsActions } from './actions';

import { createDashboardMeta, reduceWidgetsCount } from './utils';

import {
  FETCH_DASHBOARDS_LIST_SUCCESS,
  REGISTER_DASHBOARD,
  DEREGISTER_DASHBOARD,
  UPDATE_DASHBOARD,
  CREATE_DASHBOARD,
  ADD_WIDGET_TO_DASHBOARD,
  REMOVE_WIDGET_FROM_DASHBOARD,
  SHOW_DELETE_CONFIRMATION,
  HIDE_DELETE_CONFIRMATION,
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  metadata: {
    isInitiallyLoaded: false,
    error: null,
    data: [],
  },
  deleteConfirmation: {
    isVisible: false,
    dashboardId: null,
  },
  items: {},
};

const dashboardsReducer = (
  state: ReducerState = initialState,
  action: DashboardsActions
) => {
  switch (action.type) {
    case SHOW_DELETE_CONFIRMATION:
      return {
        ...state,
        deleteConfirmation: {
          ...state.deleteConfirmation,
          dashboardId: action.payload.dashboardId,
          isVisible: true,
        },
      };
    case HIDE_DELETE_CONFIRMATION:
      return {
        ...state,
        deleteConfirmation: {
          ...state.deleteConfirmation,
          dashboardId: null,
          isVisible: false,
        },
      };
    case REMOVE_WIDGET_FROM_DASHBOARD:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: reduceWidgetsCount(
            action.payload.dashboardId,
            state.metadata.data,
            'decrease'
          ),
        },
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
        metadata: {
          ...state.metadata,
          data: reduceWidgetsCount(
            action.payload.dashboardId,
            state.metadata.data,
            'increase'
          ),
        },
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
          data: [
            ...state.metadata.data,
            createDashboardMeta(action.payload.dashboardId),
          ],
        },
      };
    case DEREGISTER_DASHBOARD:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: state.metadata.data.filter(
            ({ id }) => id !== action.payload.dashboardId
          ),
        },
        items: Object.keys(state.items).reduce((acc, dashboardId) => {
          if (dashboardId !== action.payload.dashboardId) {
            return {
              ...acc,
              [dashboardId]: state.items[dashboardId],
            };
          }

          return acc;
        }, {}),
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
          isInitiallyLoaded: true,
          error: null,
          data: action.payload.dashboards,
        },
      };
    default:
      return state;
  }
};

export default dashboardsReducer;
