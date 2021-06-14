import { takeLatest, put } from 'redux-saga/effects';

import { fetchDashboardList, viewDashboard } from '../dashboards';
import { themeActions, extendTheme } from '../theme';
import { timezoneActions } from '../timezone';
import { appActions } from './index';

export function* appStart({ payload }: ReturnType<typeof appActions.appStart>) {
  const { baseTheme, initialView, dashboardId } = payload;
  if (initialView !== 'management' && dashboardId) {
    yield put(viewDashboard(dashboardId));
  }

  yield put(fetchDashboardList());
  yield put(themeActions.setBaseTheme(extendTheme(baseTheme)));
  yield put(timezoneActions.fetchTimezones());
}

export function* appSaga() {
  yield takeLatest(appActions.appStart.type, appStart);
}
