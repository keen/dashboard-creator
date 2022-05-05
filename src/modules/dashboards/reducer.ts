/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  createDashboardMeta,
  createTagsPool,
  reduceWidgetsCount,
  sortDashboards,
} from './utils';

import {
  ConnectedDashboard,
  Dashboard,
  DashboardError,
  DashboardListOrder,
  DashboardMetaData,
  ReducerState,
} from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState: ReducerState = {
  metadata: {
    isInitiallyLoaded: false,
    error: null,
    data: [],
    isSavingMetadata: false,
    isRegeneratingAccessKey: false,
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
  cachedDashboardIds: [],
  connectedDashboards: {
    isLoading: false,
    isError: false,
    items: [],
  },
  dashboardListOrder: 'recent',
};

const dashboardsSlice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    updateDashboardMetadata: (
      state,
      {
        payload,
      }: PayloadAction<{
        dashboardId: string;
        metadata: Partial<DashboardMetaData>;
      }>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: sortDashboards(
          state.metadata.data.map((dashboardMeta) => {
            if (payload.dashboardId === dashboardMeta.id) {
              return {
                ...dashboardMeta,
                ...payload.metadata,
              };
            }

            return dashboardMeta;
          }),
          state.dashboardListOrder
        ),
      };
    },
    showDeleteConfirmation: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.deleteConfirmation = {
        ...state.deleteConfirmation,
        dashboardId,
        isVisible: true,
      };
    },
    hideDeleteConfirmation: (state) => {
      state.deleteConfirmation = {
        ...state.deleteConfirmation,
        dashboardId: null,
        isVisible: false,
      };
    },
    showDashboardSettingsModal: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.dashboardSettingsModal = {
        ...state.dashboardSettingsModal,
        dashboardId,
        isVisible: true,
      };
    },
    hideDashboardSettingsModal: (state) => {
      state.dashboardSettingsModal = {
        ...state.dashboardSettingsModal,
        dashboardId: null,
        isVisible: false,
      };
    },
    showDashboardShareModal: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.dashboardShareModal = {
        ...state.dashboardShareModal,
        dashboardId,
        isVisible: true,
      };
    },
    hideDashboardShareModal: (state) => {
      state.dashboardShareModal = {
        ...state.dashboardShareModal,
        dashboardId: null,
        isVisible: false,
      };
    },
    removeWidgetFromDashboard: (
      state,
      { payload }: PayloadAction<{ dashboardId: string; widgetId: string }>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: reduceWidgetsCount(
          payload.dashboardId,
          state.metadata.data,
          'decrease'
        ),
      };
      state.items = {
        ...state.items,
        [payload.dashboardId]: {
          ...state.items[payload.dashboardId],
          settings: {
            ...state.items[payload.dashboardId].settings,
            widgets: state.items[payload.dashboardId].settings.widgets.filter(
              (id) => id !== payload.widgetId
            ),
          },
        },
      };
    },
    addWidgetToDashboard: (
      state,
      { payload }: PayloadAction<{ dashboardId: string; widgetId: string }>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: reduceWidgetsCount(
          payload.dashboardId,
          state.metadata.data,
          'increase'
        ),
      };
      state.items = {
        ...state.items,
        [payload.dashboardId]: {
          ...state.items[payload.dashboardId],
          settings: {
            ...state.items[payload.dashboardId].settings,
            widgets: [
              ...state.items[payload.dashboardId].settings.widgets,
              payload.widgetId,
            ],
          },
        },
      };
    },
    createDashboard: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: [...state.metadata.data, createDashboardMeta(dashboardId)],
      };
    },
    deleteDashboardSuccess: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: state.metadata.data.filter(({ id }) => id !== dashboardId),
      };
      state.items = Object.keys(state.items).reduce((acc, dashboardId) => {
        if (dashboardId !== dashboardId) {
          return {
            ...acc,
            [dashboardId]: state.items[dashboardId],
          };
        }
        return acc;
      }, {});
    },
    registerDashboard: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.items = {
        ...state.items,
        [dashboardId]: {
          initialized: false,
          isSaving: false,
          error: null,
          settings: null,
        },
      };
    },
    setDashboardError: (
      state,
      { payload }: PayloadAction<{ dashboardId: string; error: DashboardError }>
    ) => {
      state.items = {
        ...state.items,
        [payload.dashboardId]: {
          ...state.items[payload.dashboardId],
          error: payload.error,
        },
      };
    },
    saveDashboard: (state, { payload: dashboardId }: PayloadAction<string>) => {
      state.items = {
        ...state.items,
        [dashboardId]: {
          ...state.items[dashboardId],
          isSaving: true,
        },
      };
    },
    saveDashboardSuccess: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.items = {
        ...state.items,
        [dashboardId]: {
          ...state.items[dashboardId],
          isSaving: false,
        },
      };
    },
    saveDashboardError: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      state.items = {
        ...state.items,
        [dashboardId]: {
          ...state.items[dashboardId],
          isSaving: false,
        },
      };
    },
    updateDashboard: (
      state,
      { payload }: PayloadAction<{ dashboardId: string; settings: Dashboard }>
    ) => {
      state.items = {
        ...state.items,
        [payload.dashboardId]: {
          ...state.items[payload.dashboardId],
          initialized: true,
          settings: payload.settings,
        },
      };
    },
    setDashboardList: (
      state,
      { payload }: PayloadAction<{ dashboards: DashboardMetaData[] }>
    ) => {
      state.metadata = {
        ...state.metadata,
        isInitiallyLoaded: true,
        error: null,
        data: sortDashboards(payload.dashboards, state.dashboardListOrder),
      };
    },
    fetchDashboardsListSuccess: (
      state,
      { payload: dashboards }: PayloadAction<DashboardMetaData[]>
    ) => {
      state.metadata = {
        ...state.metadata,
        isInitiallyLoaded: true,
        error: null,
        data: sortDashboards(dashboards, state.dashboardListOrder),
      };
    },
    saveDashboardMetadata: (
      state,
      {
        payload,
      }: PayloadAction<{
        dashboardId: string;
        metadata: Partial<DashboardMetaData>;
      }>
    ) => {
      state.metadata = {
        ...state.metadata,
        isSavingMetadata: true,
      };
    },
    saveDashboardMetadataSuccess: (state) => {
      state.metadata = {
        ...state.metadata,
        isSavingMetadata: false,
      };
    },
    saveDashboardMetadataError: (state) => {
      state.metadata = {
        ...state.metadata,
        isSavingMetadata: false,
      };
    },
    setDashboardListOrder: (
      state,
      {
        payload,
      }: PayloadAction<{
        data?: DashboardMetaData[];
        order: DashboardListOrder;
      }>
    ) => {
      (state.metadata = {
        ...state.metadata,
        data: sortDashboards(state.metadata.data, payload.order),
      }),
        (state.dashboardListOrder = payload.order);
    },
    setDashboardPublicAccess: (
      state,
      {
        payload,
      }: PayloadAction<{
        dashboardId: string;
        isPublic: boolean;
        accessKey: string;
      }>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: state.metadata.data.map((dashboardMeta) => {
          if (payload.dashboardId === dashboardMeta.id) {
            return {
              ...dashboardMeta,
              isPublic: payload.isPublic,
              publicAccessKey: payload.accessKey,
            };
          }
          return dashboardMeta;
        }),
      };
    },
    addClonedDashboard: (
      state,
      { payload: dashboardMeta }: PayloadAction<DashboardMetaData>
    ) => {
      state.metadata = {
        ...state.metadata,
        data: sortDashboards(
          [...state.metadata.data, dashboardMeta],
          state.dashboardListOrder
        ),
      };
    },
    prepareTagsPool: (state) => {
      state.tagsPool = createTagsPool(state.metadata.data);
    },
    clearTagsPool: (state) => {
      state.tagsPool = [];
    },
    setTagsFilters: (state, { payload }: PayloadAction<{ tags: string[] }>) => {
      state.tagsFilters = {
        ...state.tagsFilters,
        tags: payload.tags,
      };
    },
    setTagsFiltersPublic: (
      state,
      { payload: filterPublic }: PayloadAction<boolean>
    ) => {
      state.tagsFilters = {
        ...state.tagsFilters,
        showOnlyPublicDashboards: filterPublic,
      };
    },
    updateCachedDashboardIds: (state, { payload }: PayloadAction<string[]>) => {
      state.cachedDashboardIds = payload;
    },
    unregisterDashboard: (
      state,
      { payload: dashboardId }: PayloadAction<string>
    ) => {
      const items = { ...state.items };
      delete items[dashboardId];
      state.items = items;
    },
    regenerateAccessKey: (
      state,
      { payload }: PayloadAction<{ dashboardId: string }>
    ) => {
      state.metadata = {
        ...state.metadata,
        isRegeneratingAccessKey: true,
      };
    },
    regenerateAccessKeySuccess: (state) => {
      state.metadata = {
        ...state.metadata,
        isRegeneratingAccessKey: false,
      };
    },
    regenerateAccessKeyError: (state) => {
      state.metadata = {
        ...state.metadata,
        isRegeneratingAccessKey: false,
      };
    },
    setConnectedDashboards: (
      state,
      { payload: connectedDashboards }: PayloadAction<ConnectedDashboard[]>
    ) => {
      state.connectedDashboards = {
        ...state.connectedDashboards,
        items: connectedDashboards,
      };
    },
    setConnectedDashboardsLoading: (
      state,
      { payload: isLoading }: PayloadAction<boolean>
    ) => {
      state.connectedDashboards = {
        ...state.connectedDashboards,
        isLoading,
      };
    },
    setConnectedDashboardsError: (
      state,
      { payload: isError }: PayloadAction<boolean>
    ) => {
      state.connectedDashboards = {
        ...state.connectedDashboards,
        isError,
      };
    },
  },
});

export default dashboardsSlice;
