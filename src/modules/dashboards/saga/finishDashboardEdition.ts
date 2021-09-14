import {
  finishDashboardEdition as finishDashboardEditionAction,
  saveDashboard,
  showDashboardSettingsModal,
  viewDashboard,
} from '../actions';
import { DashboardMetaData } from '../types';
import { put, select, take } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import {
  HIDE_DASHBOARD_SETTINGS_MODAL,
  SAVE_DASHBOARD_METADATA,
} from '../constants';

/**
 * Finish Dashboard edition flow - checks if user provided name for dashboard before saving
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* finishDashboardEdition({
  payload,
}: ReturnType<typeof finishDashboardEditionAction>) {
  const { dashboardId } = payload;
  const dashboardMeta: DashboardMetaData = yield select(
    getDashboardMeta,
    dashboardId
  );
  if (!dashboardMeta.title) {
    yield put(showDashboardSettingsModal(dashboardId));
    yield take([HIDE_DASHBOARD_SETTINGS_MODAL, SAVE_DASHBOARD_METADATA]);
    yield put(saveDashboard(dashboardId));
    yield put(viewDashboard(dashboardId));
  } else {
    yield put(saveDashboard(dashboardId));
    yield put(viewDashboard(dashboardId));
  }
}
