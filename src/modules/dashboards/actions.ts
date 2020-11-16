import { createAction } from '@reduxjs/toolkit';

import { DashboardMetaData, Dashboard } from './types';

import {
  FETCH_DASHBOARDS_LIST,
  FETCH_DASHBOARDS_LIST_SUCCESS,
  FETCH_DASHBOARDS_LIST_ERROR,
  REGISTER_DASHBOARD,
  UPDATE_DASHBOARD,
  EDIT_DASHBOARD,
  SAVE_DASHBOARD,
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

export const editDashboard = createAction(
  EDIT_DASHBOARD,
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

export type DashboardsActions =
  | ReturnType<typeof fetchDashboardList>
  | ReturnType<typeof fetchDashboardListSuccess>
  | ReturnType<typeof fetchDashboardListError>
  | ReturnType<typeof registerDashboard>
  | ReturnType<typeof saveDashboard>
  | ReturnType<typeof updateDashboard>
  | ReturnType<typeof editDashboard>;
