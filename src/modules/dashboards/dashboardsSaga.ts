/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { spawn, takeEvery, takeLatest } from 'redux-saga/effects';

import {
  cloneDashboard,
  createDashboard,
  deleteDashboard,
  editDashboard,
  fetchDashboardList,
  finishDashboardEdition,
  initializeDashboardWidgets,
  persistDashboardsOrder,
  rehydrateDashboardsOrder,
  removeWidgetFromDashboard,
  resetDashboardFilters,
  saveDashboard,
  saveDashboardMetadata,
  viewDashboard,
  viewPublicDashboard,
  setAccessKey,
  updateAccessKeyOptions,
  regenerateAccessKey,
  exportDashboardToHtml,
  updateCachedDashboardsList,
  calculateYPositionAndAddWidget,
} from './saga';

import { dashboardsActions } from './index';

export function* showDashboardDeleteConfirmation() {
  yield window.scrollTo(0, 0);
}

export function* dashboardsSaga() {
  yield spawn(rehydrateDashboardsOrder);
  yield takeLatest(
    dashboardsActions.fetchDashboardList.type,
    fetchDashboardList
  );
  yield takeLatest(
    dashboardsActions.setDashboardListOrder.type,
    persistDashboardsOrder
  );
  yield takeLatest(dashboardsActions.createDashboard.type, createDashboard);
  yield takeLatest(dashboardsActions.saveDashboard.type, saveDashboard);
  yield takeLatest(
    dashboardsActions.saveDashboardMetadata.type,
    saveDashboardMetadata
  );
  yield takeLatest(dashboardsActions.deleteDashboard.type, deleteDashboard);
  yield takeLatest(dashboardsActions.viewDashboard.type, viewDashboard);
  yield takeLatest(
    dashboardsActions.viewPublicDashboard.type,
    viewPublicDashboard
  );
  yield takeLatest(dashboardsActions.editDashboard.type, editDashboard);
  yield takeLatest(
    dashboardsActions.removeWidgetFromDashboard.type,
    removeWidgetFromDashboard
  );
  yield takeLatest(
    dashboardsActions.initializeDashboardWidgets.type,
    initializeDashboardWidgets
  );
  yield takeLatest(
    dashboardsActions.showDeleteConfirmation.type,
    showDashboardDeleteConfirmation
  );
  yield takeLatest(
    dashboardsActions.setDashboardPublicAccess.type,
    setAccessKey
  );
  yield takeLatest(
    dashboardsActions.updateAccessKeyOptions.type,
    updateAccessKeyOptions
  );
  yield takeLatest(
    dashboardsActions.regenerateAccessKey.type,
    regenerateAccessKey
  );
  yield takeLatest(dashboardsActions.cloneDashboard.type, cloneDashboard);
  yield takeLatest(
    dashboardsActions.exportDashboardToHtml.type,
    exportDashboardToHtml
  );
  yield takeEvery(
    [
      dashboardsActions.viewDashboard.type,
      dashboardsActions.editDashboard.type,
    ],
    updateCachedDashboardsList
  );
  yield takeEvery(
    dashboardsActions.calculateYPositionAndAddWidget.type,
    calculateYPositionAndAddWidget
  );
  yield takeEvery(
    dashboardsActions.resetDashboardFilters.type,
    resetDashboardFilters
  );
  yield takeEvery(
    dashboardsActions.finishDashboardEdition.type,
    finishDashboardEdition
  );
}
