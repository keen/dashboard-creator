/* eslint-disable @typescript-eslint/naming-convention */
import { getContext, put } from 'redux-saga/effects';
import { StatusCodes } from 'http-status-codes';

import { timezoneSlice } from '../reducer';
import { KEEN_ANALYSIS, TIMEZONES_API_HOST } from '../../../constants';

/**
 * Fetch collection of timezones from API
 * @return void
 *
 */
export function* fetchTimezonesHandler() {
  try {
    yield put(timezoneSlice.actions.setTimezonesLoading(true));
    const timezonesApiHost = yield getContext(TIMEZONES_API_HOST);
    const {
      config: { protocol },
    } = yield getContext(KEEN_ANALYSIS);
    const response: Response = yield fetch(
      `${protocol}://${timezonesApiHost}/timezones`
    );

    if (response.status === StatusCodes.OK) {
      const timezones = yield response.json();
      const timezonesCollection = timezones.map(
        (timezone: Record<string, any>) => ({
          name: timezone.name,
          numberOfSecondsToOffsetTime:
            timezone.number_of_seconds_to_offset_time,
          utcOffset: timezone.utc_offset,
        })
      );

      yield put(timezoneSlice.actions.setTimezones(timezonesCollection));
    } else {
      yield put(timezoneSlice.actions.setError(true));
    }
  } catch (err) {
    yield put(timezoneSlice.actions.setError(true));
  } finally {
    yield put(timezoneSlice.actions.setTimezonesLoading(false));
  }
}
