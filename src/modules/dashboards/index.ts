import dashboardsSlice, { initialState } from './reducer';
import { dashboardsSaga } from './dashboardsSaga';
import {
  calculateYPositionAndAddWidget,
  cloneDashboard,
  confirmDashboardDelete,
  deleteDashboard,
  deregisterDashboard,
  editDashboard,
  exportDashboardToHtml,
  fetchDashboardList,
  fetchDashboardListError,
  finishDashboardEdition,
  initializeDashboardWidgets,
  resetDashboardFilters,
  shareDashboard,
  updateAccessKeyOptions,
  viewDashboard,
  viewPublicDashboard,
} from './actions';

import { dashboardsSelectors } from './selectors';
import {
  DashboardError,
  DashboardListOrder,
  DashboardMetaData,
  DashboardModel,
  DashboardSettings,
} from './types';
import { DASHBOARDS_ORDER } from './constants';
import {
  createCodeSnippet,
  createDashboardSettings,
  extendDashboardSettings,
  sortDashboards,
} from './utils';

const dashboardsReducer = dashboardsSlice.reducer;
const dashboardsActions = {
  ...dashboardsSlice.actions,
  fetchDashboardList,
  fetchDashboardListError,
  editDashboard,
  viewDashboard,
  viewPublicDashboard,
  deleteDashboard,
  cloneDashboard,
  shareDashboard,
  deregisterDashboard,
  initializeDashboardWidgets,
  confirmDashboardDelete,
  updateAccessKeyOptions,
  exportDashboardToHtml,
  calculateYPositionAndAddWidget,
  resetDashboardFilters,
  finishDashboardEdition,
};

const dashboardUtils = {
  createCodeSnippet,
  extendDashboardSettings,
  createDashboardSettings,
  sortDashboards,
};

export {
  dashboardsReducer,
  dashboardUtils,
  dashboardsActions,
  dashboardsSaga,
  DASHBOARDS_ORDER,
  DashboardError,
  dashboardsSelectors,
  initialState,
};

export type {
  DashboardMetaData,
  DashboardModel,
  DashboardSettings,
  DashboardListOrder,
};
