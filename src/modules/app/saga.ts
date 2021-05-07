import { takeLatest, put } from 'redux-saga/effects';

import { fetchDashboardList } from '../dashboards';
import { setBaseTheme } from '../theme';
import { timezoneActions } from '../timezone';
import { appActions } from './index';

export function* appStart({ payload }: ReturnType<typeof appActions.appStart>) {
  const { baseTheme } = payload;
  yield put(fetchDashboardList());
  yield put(setBaseTheme(baseTheme));
  yield put(timezoneActions.fetchTimezones());
}

export function* appSaga() {
  yield takeLatest(appActions.appStart.type, appStart);
}
