import { DashboardMetaData } from '../types';
import { put, select, take } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import { dashboardsActions } from '../index';

/**
 * Finish Dashboard edition flow - checks if user provided name for dashboard before saving
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* finishDashboardEdition({
  payload,
}: ReturnType<typeof dashboardsActions.finishDashboardEdition>) {
  const { dashboardId } = payload;
  const dashboardMeta: DashboardMetaData = yield select(
    getDashboardMeta,
    dashboardId
  );
  if (!dashboardMeta.title) {
    yield put(dashboardsActions.showDashboardSettingsModal(dashboardId));
    yield take([
      dashboardsActions.hideDashboardSettingsModal.type,
      dashboardsActions.saveDashboardMetadata.type,
    ]);
    yield put(dashboardsActions.saveDashboard(dashboardId));
    yield put(dashboardsActions.viewDashboard(dashboardId));
  } else {
    yield put(dashboardsActions.saveDashboard(dashboardId));
    yield put(dashboardsActions.viewDashboard(dashboardId));
  }
}
