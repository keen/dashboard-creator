/* eslint-disable @typescript-eslint/camelcase */

import { timezoneActions } from './index';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchTimezones() {
  try {
    // todo fetch timezones when api ready

    const mockResponse = [].map((timezone) => ({
      name: timezone.name,
      utcOffset: timezone.utc_offset,
    }));

    yield put(timezoneActions.setTimezones(mockResponse));
  } catch (err) {
    console.error(err);
  }
}

export function* timezoneSaga() {
  yield takeLatest(timezoneActions.fetchTimezones.type, fetchTimezones);
}
