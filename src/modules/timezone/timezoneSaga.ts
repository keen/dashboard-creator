import { takeLatest } from 'redux-saga/effects';

import { fetchTimezones } from './actions';
import { fetchTimezonesHandler } from './saga';

export function* timezoneSaga() {
  yield takeLatest(fetchTimezones.type, fetchTimezonesHandler);
}
