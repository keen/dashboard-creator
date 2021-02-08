import { DashboardsActions } from './actions';

import {
  createDashboardMeta,
  reduceWidgetsCount,
  sortDashboards,
  createTagsPool,
} from './utils';

import {
  FETCH_DASHBOARDS_LIST_SUCCESS,
  SAVE_DASHBOARD,
  SAVE_DASHBOARD_SUCCESS,
  SAVE_DASHBOARD_ERROR,
  UPDATE_DASHBOARD_METADATA,
  SAVE_DASHBOARD_METADATA,
  SAVE_DASHBOARD_METADATA_SUCCESS,
  SAVE_DASHBOARD_METADATA_ERROR,
  REGISTER_DASHBOARD,
  DELETE_DASHBOARD_SUCCESS,
  UPDATE_DASHBOARD,
  CREATE_DASHBOARD,
  SET_DASHBOARD_LIST,
  SET_DASHBOARD_ERROR,
  ADD_WIDGET_TO_DASHBOARD,
  REMOVE_WIDGET_FROM_DASHBOARD,
  SHOW_DELETE_CONFIRMATION,
  HIDE_DELETE_CONFIRMATION,
  SHOW_DASHBOARD_SETTINGS_MODAL,
  HIDE_DASHBOARD_SETTINGS_MODAL,
  SHOW_DASHBOARD_SHARE_MODAL,
  HIDE_DASHBOARD_SHARE_MODAL,
  SET_DASHBOARD_LIST_ORDER,
  SET_DASHBOARD_PUBLIC_ACCESS,
  ADD_CLONED_DASHBOARD,
  PREPARE_TAGS_POOL,
  CLEAR_TAGS_POOL,
  SET_TAGS_FILTERS,
  SET_TAGS_FILTERS_PUBLIC,
} from './constants';

import { ReducerState } from './types';

export const initialState: ReducerState = {
  metadata: {
    isInitiallyLoaded: false,
    error: null,
    data: [],
    isSavingMetadata: false,
  },
  deleteConfirmation: {
    isVisible: false,
    dashboardId: null,
  },
  dashboardSettingsModal: {
    isVisible: false,
    dashboardId: null,
  },
  dashboardShareModal: {
    isVisible: false,
    dashboardId: null,
  },
  tagsPool: [],
  tagsFilters: {
    showOnlyPublicDashboards: false,
    tags: [],
  },
  items: {},
  dashboardListOrder: 'recent',
};

const dashboardsReducer = (
  state: ReducerState = initialState,
  action: DashboardsActions
) => {
  switch (action.type) {
    case UPDATE_DASHBOARD_METADATA:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: state.metadata.data.map((dashboardMeta) => {
            if (action.payload.dashboardId === dashboardMeta.id) {
              return {
                ...dashboardMeta,
                ...action.payload.metadata,
              };
            }

            return dashboardMeta;
          }),
        },
      };
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
    case SHOW_DASHBOARD_SETTINGS_MODAL:
      return {
        ...state,
        dashboardSettingsModal: {
          ...state.dashboardSettingsModal,
          dashboardId: action.payload.dashboardId,
          isVisible: true,
        },
      };
    case HIDE_DASHBOARD_SETTINGS_MODAL:
      return {
        ...state,
        dashboardSettingsModal: {
          ...state.dashboardSettingsModal,
          dashboardId: null,
          isVisible: false,
        },
      };
    case SHOW_DASHBOARD_SHARE_MODAL:
      return {
        ...state,
        dashboardShareModal: {
          ...state.dashboardShareModal,
          dashboardId: action.payload.dashboardId,
          isVisible: true,
        },
      };
    case HIDE_DASHBOARD_SHARE_MODAL:
      return {
        ...state,
        dashboardShareModal: {
          ...state.dashboardShareModal,
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
    case DELETE_DASHBOARD_SUCCESS:
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
            isSaving: false,
            error: null,
            settings: null,
          },
        },
      };
    case SET_DASHBOARD_ERROR:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            error: action.payload.error,
          },
        },
      };
    case SAVE_DASHBOARD:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            isSaving: true,
          },
        },
      };
    case SAVE_DASHBOARD_SUCCESS:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            isSaving: false,
          },
        },
      };
    case SAVE_DASHBOARD_ERROR:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            isSaving: false,
          },
        },
      };
    case UPDATE_DASHBOARD:
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.dashboardId]: {
            ...state.items[action.payload.dashboardId],
            initialized: true,
            settings: action.payload.settings,
          },
        },
      };
    case SET_DASHBOARD_LIST:
    case FETCH_DASHBOARDS_LIST_SUCCESS:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isInitiallyLoaded: true,
          error: null,
          data: sortDashboards(
            action.payload.dashboards,
            state.dashboardListOrder
          ),
        },
      };
    case SAVE_DASHBOARD_METADATA:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isSavingMetaData: true,
        },
      };
    case SAVE_DASHBOARD_METADATA_SUCCESS:
    case SAVE_DASHBOARD_METADATA_ERROR:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          isSavingMetaData: false,
        },
      };
    case SET_DASHBOARD_LIST_ORDER:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: sortDashboards(state.metadata.data, action.payload.order),
        },
        dashboardListOrder: action.payload.order,
      };
    case SET_DASHBOARD_PUBLIC_ACCESS:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: state.metadata.data.map((dashboardMeta) => {
            if (action.payload.dashboardId === dashboardMeta.id) {
              return {
                ...dashboardMeta,
                isPublic: action.payload.isPublic,
              };
            }

            return dashboardMeta;
          }),
        },
      };
    case ADD_CLONED_DASHBOARD:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          data: sortDashboards(
            [...state.metadata.data, action.payload.dashboardMeta],
            state.dashboardListOrder
          ),
        },
      };
    case PREPARE_TAGS_POOL:
      return {
        ...state,
        tagsPool: createTagsPool(state.metadata.data),
      };
    case CLEAR_TAGS_POOL:
      return {
        ...state,
        tagsPool: [],
      };
    case SET_TAGS_FILTERS:
      return {
        ...state,
        tagsFilters: {
          ...state.tagsFilters,
          tags: action.payload.tags,
        },
      };
    case SET_TAGS_FILTERS_PUBLIC:
      return {
        ...state,
        tagsFilters: {
          ...state.tagsFilters,
          showOnlyPublicDashboards: action.payload.filterPublic,
        },
      };
    default:
      return state;
  }
};

export default dashboardsReducer;
