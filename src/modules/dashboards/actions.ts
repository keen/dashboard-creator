import { createAction } from '@reduxjs/toolkit';

import {
  DashboardMetaData,
  Dashboard,
  DashboardError,
  DashboardListOrder,
} from './types';

import {
  FETCH_DASHBOARDS_LIST,
  FETCH_DASHBOARDS_LIST_SUCCESS,
  FETCH_DASHBOARDS_LIST_ERROR,
  ADD_WIDGET_TO_DASHBOARD,
  REMOVE_WIDGET_FROM_DASHBOARD,
  REGISTER_DASHBOARD,
  DEREGISTER_DASHBOARD,
  CREATE_DASHBOARD,
  UPDATE_DASHBOARD,
  SHARE_DASHBOARD,
  CLONE_DASHBOARD,
  DELETE_DASHBOARD,
  DELETE_DASHBOARD_SUCCESS,
  EDIT_DASHBOARD,
  SET_DASHBOARD_LIST,
  SET_DASHBOARD_ERROR,
  SAVE_DASHBOARD,
  SAVE_DASHBOARD_SUCCESS,
  SAVE_DASHBOARD_ERROR,
  SAVE_DASHBOARD_METADATA,
  SAVE_DASHBOARD_METADATA_SUCCESS,
  SAVE_DASHBOARD_METADATA_ERROR,
  UPDATE_DASHBOARD_METADATA,
  VIEW_DASHBOARD,
  VIEW_PUBLIC_DASHBOARD,
  INITIALIZE_DASHBOARD_WIDGETS,
  SHOW_DELETE_CONFIRMATION,
  HIDE_DELETE_CONFIRMATION,
  CONFIRM_DASHBOARD_DELETE,
  SHOW_DASHBOARD_SETTINGS_MODAL,
  HIDE_DASHBOARD_SETTINGS_MODAL,
  SHOW_DASHBOARD_SHARE_MODAL,
  HIDE_DASHBOARD_SHARE_MODAL,
  SET_DASHBOARD_LIST_ORDER,
  SET_DASHBOARD_PUBLIC_ACCESS,
  UPDATE_ACCESS_KEY_OPTIONS,
  REGENERATE_ACCESS_KEY,
  ADD_CLONED_DASHBOARD,
  EXPORT_DASHBOARD_TO_HTML,
  PREPARE_TAGS_POOL,
  CLEAR_TAGS_POOL,
  SET_TAGS_FILTERS,
  SET_TAGS_FILTERS_PUBLIC,
  UPDATE_CACHED_DASHBOARD_IDS,
  UNREGISTER_DASHBOARD,
  CALCULATE_Y_POSITION_AND_ADD_WIDGET,
  REGENERATE_ACCESS_KEY_SUCCESS,
  REGENERATE_ACCESS_KEY_ERROR,
  RESET_DASHBOARD_FILTERS,
} from './constants';
import { WidgetType } from '../../types';

export const fetchDashboardList = createAction(FETCH_DASHBOARDS_LIST);

export const fetchDashboardListSuccess = createAction(
  FETCH_DASHBOARDS_LIST_SUCCESS,
  (dashboards: DashboardMetaData[]) => ({
    payload: {
      dashboards,
    },
  })
);

export const fetchDashboardListError = createAction(
  FETCH_DASHBOARDS_LIST_ERROR
);

export const setDashboardList = createAction(
  SET_DASHBOARD_LIST,
  (dashboards: DashboardMetaData[]) => ({
    payload: {
      dashboards,
    },
  })
);

export const addWidgetToDashboard = createAction(
  ADD_WIDGET_TO_DASHBOARD,
  (dashboardId: string, widgetId: string) => ({
    payload: {
      dashboardId,
      widgetId,
    },
  })
);

export const removeWidgetFromDashboard = createAction(
  REMOVE_WIDGET_FROM_DASHBOARD,
  (dashboardId: string, widgetId: string) => ({
    payload: {
      dashboardId,
      widgetId,
    },
  })
);

export const createDashboard = createAction(
  CREATE_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const editDashboard = createAction(
  EDIT_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const viewDashboard = createAction(
  VIEW_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const viewPublicDashboard = createAction(
  VIEW_PUBLIC_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const deleteDashboardSuccess = createAction(
  DELETE_DASHBOARD_SUCCESS,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const deleteDashboard = createAction(
  DELETE_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const cloneDashboard = createAction(
  CLONE_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const shareDashboard = createAction(
  SHARE_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const setDashboardError = createAction(
  SET_DASHBOARD_ERROR,
  (dashboardId: string, error: null | DashboardError) => ({
    payload: {
      dashboardId,
      error,
    },
  })
);

export const saveDashboard = createAction(
  SAVE_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const saveDashboardSuccess = createAction(
  SAVE_DASHBOARD_SUCCESS,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const saveDashboardError = createAction(
  SAVE_DASHBOARD_ERROR,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const registerDashboard = createAction(
  REGISTER_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const deregisterDashboard = createAction(
  DEREGISTER_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const updateDashboard = createAction(
  UPDATE_DASHBOARD,
  (dashboardId: string, settings: Dashboard) => ({
    payload: {
      dashboardId,
      settings,
    },
  })
);

export const saveDashboardMeta = createAction(
  SAVE_DASHBOARD_METADATA,
  (dashboardId: string, metadata: Partial<DashboardMetaData>) => ({
    payload: {
      dashboardId,
      metadata,
    },
  })
);

export const saveDashboardMetaSuccess = createAction(
  SAVE_DASHBOARD_METADATA_SUCCESS
);

export const saveDashboardMetaError = createAction(
  SAVE_DASHBOARD_METADATA_ERROR
);

export const updateDashboardMeta = createAction(
  UPDATE_DASHBOARD_METADATA,
  (dashboardId: string, metadata: Partial<DashboardMetaData>) => ({
    payload: {
      dashboardId,
      metadata,
    },
  })
);

export const initializeDashboardWidgets = createAction(
  INITIALIZE_DASHBOARD_WIDGETS,
  (dashboardId: string, widgetsId: string[]) => ({
    payload: {
      dashboardId,
      widgetsId,
    },
  })
);

export const showDeleteConfirmation = createAction(
  SHOW_DELETE_CONFIRMATION,
  (dashboardId: string) => ({
    payload: { dashboardId },
  })
);

export const hideDeleteConfirmation = createAction(HIDE_DELETE_CONFIRMATION);

export const confirmDashboardDelete = createAction(CONFIRM_DASHBOARD_DELETE);

export const showDashboardSettingsModal = createAction(
  SHOW_DASHBOARD_SETTINGS_MODAL,
  (dashboardId: string) => ({
    payload: { dashboardId },
  })
);

export const hideDashboardSettingsModal = createAction(
  HIDE_DASHBOARD_SETTINGS_MODAL
);

export const showDashboardShareModal = createAction(
  SHOW_DASHBOARD_SHARE_MODAL,
  (dashboardId: string) => ({
    payload: { dashboardId },
  })
);

export const hideDashboardShareModal = createAction(HIDE_DASHBOARD_SHARE_MODAL);

export const setDashboardListOrder = createAction(
  SET_DASHBOARD_LIST_ORDER,
  (order: DashboardListOrder) => ({
    payload: {
      order,
    },
  })
);

export const setDashboardPublicAccess = createAction(
  SET_DASHBOARD_PUBLIC_ACCESS,
  (dashboardId: string, isPublic: boolean, accessKey: null | string) => ({
    payload: {
      dashboardId,
      isPublic,
      accessKey,
    },
  })
);

export const updateAccessKeyOptions = createAction(UPDATE_ACCESS_KEY_OPTIONS);
export const regenerateAccessKey = createAction(
  REGENERATE_ACCESS_KEY,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const regenerateAccessKeySuccess = createAction(
  REGENERATE_ACCESS_KEY_SUCCESS
);

export const regenerateAccessKeyError = createAction(
  REGENERATE_ACCESS_KEY_ERROR
);

export const addClonedDashboard = createAction(
  ADD_CLONED_DASHBOARD,
  (dashboardMeta: DashboardMetaData) => ({
    payload: {
      dashboardMeta,
    },
  })
);

export const exportDashboardToHtml = createAction(
  EXPORT_DASHBOARD_TO_HTML,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const prepareTagsPool = createAction(PREPARE_TAGS_POOL);

export const clearTagsPool = createAction(CLEAR_TAGS_POOL);

export const setTagsFilters = createAction(
  SET_TAGS_FILTERS,
  (tags: string[]) => ({
    payload: {
      tags,
    },
  })
);

export const setTagsFiltersPublic = createAction(
  SET_TAGS_FILTERS_PUBLIC,
  (filterPublic: boolean) => ({
    payload: {
      filterPublic,
    },
  })
);

export const updateCachedDashboardIds = createAction(
  UPDATE_CACHED_DASHBOARD_IDS,
  (dashboardIds: string[]) => ({
    payload: {
      dashboardIds,
    },
  })
);

export const unregisterDashboard = createAction(
  UNREGISTER_DASHBOARD,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const calculateYPositionAndAddWidget = createAction(
  CALCULATE_Y_POSITION_AND_ADD_WIDGET,
  (dashboardId: string, widgetType: WidgetType) => ({
    payload: {
      dashboardId,
      widgetType,
    },
  })
);

export const resetDashboardFilters = createAction(
  RESET_DASHBOARD_FILTERS,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export type DashboardsActions =
  | ReturnType<typeof fetchDashboardList>
  | ReturnType<typeof fetchDashboardListSuccess>
  | ReturnType<typeof fetchDashboardListError>
  | ReturnType<typeof createDashboard>
  | ReturnType<typeof updateDashboardMeta>
  | ReturnType<typeof registerDashboard>
  | ReturnType<typeof deregisterDashboard>
  | ReturnType<typeof shareDashboard>
  | ReturnType<typeof cloneDashboard>
  | ReturnType<typeof deleteDashboard>
  | ReturnType<typeof deleteDashboardSuccess>
  | ReturnType<typeof saveDashboard>
  | ReturnType<typeof saveDashboardSuccess>
  | ReturnType<typeof saveDashboardError>
  | ReturnType<typeof updateDashboard>
  | ReturnType<typeof viewDashboard>
  | ReturnType<typeof viewPublicDashboard>
  | ReturnType<typeof setDashboardError>
  | ReturnType<typeof setDashboardList>
  | ReturnType<typeof editDashboard>
  | ReturnType<typeof addWidgetToDashboard>
  | ReturnType<typeof removeWidgetFromDashboard>
  | ReturnType<typeof initializeDashboardWidgets>
  | ReturnType<typeof showDeleteConfirmation>
  | ReturnType<typeof hideDeleteConfirmation>
  | ReturnType<typeof confirmDashboardDelete>
  | ReturnType<typeof showDashboardSettingsModal>
  | ReturnType<typeof hideDashboardSettingsModal>
  | ReturnType<typeof saveDashboardMeta>
  | ReturnType<typeof saveDashboardMetaSuccess>
  | ReturnType<typeof saveDashboardMetaError>
  | ReturnType<typeof showDashboardShareModal>
  | ReturnType<typeof hideDashboardShareModal>
  | ReturnType<typeof setDashboardListOrder>
  | ReturnType<typeof setDashboardPublicAccess>
  | ReturnType<typeof updateAccessKeyOptions>
  | ReturnType<typeof regenerateAccessKey>
  | ReturnType<typeof regenerateAccessKeySuccess>
  | ReturnType<typeof regenerateAccessKeyError>
  | ReturnType<typeof setDashboardListOrder>
  | ReturnType<typeof addClonedDashboard>
  | ReturnType<typeof exportDashboardToHtml>
  | ReturnType<typeof prepareTagsPool>
  | ReturnType<typeof clearTagsPool>
  | ReturnType<typeof setTagsFilters>
  | ReturnType<typeof setTagsFiltersPublic>
  | ReturnType<typeof updateCachedDashboardIds>
  | ReturnType<typeof unregisterDashboard>
  | ReturnType<typeof calculateYPositionAndAddWidget>
  | ReturnType<typeof resetDashboardFilters>;
