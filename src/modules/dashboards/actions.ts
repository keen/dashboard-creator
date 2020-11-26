import { createAction } from '@reduxjs/toolkit';

import { DashboardMetaData, Dashboard } from './types';

import {
  FETCH_DASHBOARDS_LIST,
  FETCH_DASHBOARDS_LIST_SUCCESS,
  FETCH_DASHBOARDS_LIST_ERROR,
  ADD_WIDGET_TO_DASHBOARD,
  REMOVE_WIDGET_FROM_DASHBOARD,
  REGISTER_DASHBOARD,
  CREATE_DASHBOARD,
  UPDATE_DASHBOARD,
  SHARE_DASHBOARD,
  CLONE_DASHBOARD,
  DELETE_DASHBOARD,
  EDIT_DASHBOARD,
  SAVE_DASHBOARD,
  VIEW_DASHBOARD,
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

export const registerDashboard = createAction(
  REGISTER_DASHBOARD,
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

deleteDashboard;

export type DashboardsActions =
  | ReturnType<typeof fetchDashboardList>
  | ReturnType<typeof fetchDashboardListSuccess>
  | ReturnType<typeof fetchDashboardListError>
  | ReturnType<typeof createDashboard>
  | ReturnType<typeof registerDashboard>
  | ReturnType<typeof shareDashboard>
  | ReturnType<typeof cloneDashboard>
  | ReturnType<typeof deleteDashboard>
  | ReturnType<typeof saveDashboard>
  | ReturnType<typeof updateDashboard>
  | ReturnType<typeof viewDashboard>
  | ReturnType<typeof editDashboard>
  | ReturnType<typeof addWidgetToDashboard>
  | ReturnType<typeof removeWidgetFromDashboard>;
