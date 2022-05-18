import { createAction } from '@reduxjs/toolkit';

import { FINISH_DASHBOARD_EDITION } from './constants';
import { WidgetType } from '../../types';

export const fetchDashboardList = createAction(
  '@dashboards/FETCH_DASHBOARDS_LIST'
);

export const fetchDashboardListError = createAction(
  '@dashboards/FETCH_DASHBOARDS_LIST_ERROR'
);

export const editDashboard = createAction(
  '@dashboards/EDIT_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const viewDashboard = createAction(
  '@dashboards/VIEW_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const viewPublicDashboard = createAction(
  '@dashboards/VIEW_PUBLIC_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const deleteDashboard = createAction(
  '@dashboards/DELETE_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const cloneDashboard = createAction(
  '@dashboards/CLONE_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const shareDashboard = createAction(
  '@dashboards/SHARE_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const deregisterDashboard = createAction(
  '@dashboards/DEREGISTER_DASHBOARD',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const initializeDashboardWidgets = createAction(
  '@dashboards/INITIALIZE_DASHBOARD_WIDGETS',
  (dashboardId: string, widgetsId: string[]) => ({
    payload: {
      dashboardId,
      widgetsId,
    },
  })
);
export const confirmDashboardDelete = createAction(
  '@dashboards/CONFIRM_DASHBOARD_DELETE'
);

export const updateAccessKeyOptions = createAction(
  '@dashboards/UPDATE_ACCESS_KEY_OPTIONS'
);

export const exportDashboardToHtml = createAction(
  '@dashboard/EXPORT_DASHBOARD_TO_HTML',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const calculateYPositionAndAddWidget = createAction(
  '@dashboard/CALCULATE_Y_POSITION_AND_ADD_WIDGET',
  (dashboardId: string, widgetType: WidgetType) => ({
    payload: {
      dashboardId,
      widgetType,
    },
  })
);

export const resetDashboardFilters = createAction(
  '@dashboard/RESET_DASHBOARD_FILTERS',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export const finishDashboardEdition = createAction(
  FINISH_DASHBOARD_EDITION,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);
