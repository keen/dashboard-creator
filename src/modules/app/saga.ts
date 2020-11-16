import { takeLatest, put } from 'redux-saga/effects';

import { fetchDashboardList } from '../dashboards';

import { APP_START } from './constants';

export function* appStart() {
  yield put(fetchDashboardList());
}

export function* appSaga() {
  yield takeLatest(APP_START, appStart);
}
