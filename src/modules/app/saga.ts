import { takeLatest, put } from 'redux-saga/effects';

import { fetchDashboardList } from '../dashboards';
import { setBaseTheme } from '../theme';
import { appStart as appStartAction } from './actions';

import { APP_START } from './constants';
import { timezoneActions } from '../timezone';

export function* appStart({ payload }: ReturnType<typeof appStartAction>) {
  const {
    dashboards: { baseTheme },
  } = payload;
  yield put(fetchDashboardList());
  yield put(setBaseTheme(baseTheme));
  yield put(timezoneActions.fetchTimezones());
}

export function* appSaga() {
  yield takeLatest(APP_START, appStart);
}
