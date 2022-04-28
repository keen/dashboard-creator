import { takeEvery, takeLatest } from 'redux-saga/effects';

import {
  prepareFilterTargetProperties,
  setupDashboardEventStreams,
  setWidgetHighlight,
} from './saga';
import { filterActions } from './index';

export function* filterSaga() {
  yield takeLatest(
    filterActions.setEventStream.type,
    prepareFilterTargetProperties
  );
  yield takeLatest(
    filterActions.setupDashboardEventStreams.type,
    setupDashboardEventStreams
  );
  yield takeEvery(filterActions.updateConnection.type, setWidgetHighlight);
}
