import { takeLatest, put } from 'redux-saga/effects';

import { fetchDashboardList } from '../dashboards';
import { setBaseTheme } from '../theme';
import { appStart as appStartAction } from './actions';

import { APP_START } from './constants';

export function* appStart({ payload }: ReturnType<typeof appStartAction>) {
  const { baseTheme } = payload;
  yield put(fetchDashboardList());
  yield put(setBaseTheme(baseTheme));
}

export function* appSaga() {
  yield takeLatest(APP_START, appStart);
}
