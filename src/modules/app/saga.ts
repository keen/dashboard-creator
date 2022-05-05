import { takeLatest, put } from 'redux-saga/effects';

import { themeActions, extendTheme } from '../theme';
import { timezoneActions } from '../timezone';
import { appActions } from './index';
import { dashboardsActions } from '../dashboards';

export function* appStart({ payload }: ReturnType<typeof appActions.appStart>) {
  const { baseTheme, initialView, dashboardId } = payload;
  if (initialView !== 'management' && dashboardId) {
    yield put(dashboardsActions.viewDashboard(dashboardId));
  }

  yield put(dashboardsActions.fetchDashboardList());
  yield put(themeActions.setBaseTheme(extendTheme(baseTheme)));
  yield put(timezoneActions.fetchTimezones());
}

export function* appSaga() {
  yield takeLatest(appActions.appStart.type, appStart);
}
