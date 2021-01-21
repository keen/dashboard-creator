import { createAction } from '@reduxjs/toolkit';

import { DashboardMetaData, Dashboard } from './types';

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
  SAVE_DASHBOARD,
  SAVE_DASHBOARD_SUCCESS,
  SAVE_DASHBOARD_ERROR,
  SAVE_DASHBOARD_METADATA,
  SAVE_DASHBOARD_METADATA_SUCCESS,
  SAVE_DASHBOARD_METADATA_ERROR,
  UPDATE_DASHBOARD_METADATA,
  VIEW_DASHBOARD,
  INITIALIZE_DASHBOARD_WIDGETS,
  SHOW_DELETE_CONFIRMATION,
  HIDE_DELETE_CONFIRMATION,
  CONFIRM_DASHBOARD_DELETE,
  SHOW_DASHBOARD_SETTINGS_MODAL,
  HIDE_DASHBOARD_SETTINGS_MODAL,
  SET_TAGS_POOL,
  SET_DASHBOARD_LIST_ORDER,
  ADD_CLONED_DASHBOARD,
} from './constants';

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

export const setTagsPool = createAction(
  SET_TAGS_POOL,
  (tagsPool: string[]) => ({
    payload: { tagsPool },
  })
);

export const setDashboardListOrder = createAction(
  SET_DASHBOARD_LIST_ORDER,
  (order: string) => ({
    payload: {
      order,
    },
  })
);

export const addClonedDashboard = createAction(
  ADD_CLONED_DASHBOARD,
  (dashboardMeta: DashboardMetaData) => ({
    payload: {
      dashboardMeta,
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
  | ReturnType<typeof editDashboard>
  | ReturnType<typeof addWidgetToDashboard>
  | ReturnType<typeof removeWidgetFromDashboard>
  | ReturnType<typeof initializeDashboardWidgets>
  | ReturnType<typeof showDeleteConfirmation>
  | ReturnType<typeof hideDeleteConfirmation>
  | ReturnType<typeof confirmDashboardDelete>
  | ReturnType<typeof showDashboardSettingsModal>
  | ReturnType<typeof hideDashboardSettingsModal>
  | ReturnType<typeof setTagsPool>
  | ReturnType<typeof saveDashboardMeta>
  | ReturnType<typeof saveDashboardMetaSuccess>
  | ReturnType<typeof saveDashboardMetaError>
  | ReturnType<typeof setDashboardListOrder>
  | ReturnType<typeof addClonedDashboard>;
