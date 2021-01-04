import { takeLatest, put, select, getContext } from 'redux-saga/effects';

import { runQuerySuccess, runQueryError } from './actions';

import { getChartEditor } from './selectors';

import { RUN_QUERY } from './constants';
import { KEEN_ANALYSIS, NOTIFICATION_MANAGER } from '../../constants';

export function* runQuery() {
  const { querySettings } = yield select(getChartEditor);
  const keenAnalysis = yield getContext(KEEN_ANALYSIS);

  try {
    const analysisResult = yield keenAnalysis.query(querySettings);
    yield put(runQuerySuccess(analysisResult));
  } catch (error) {
    const { body } = error;
    yield put(runQueryError());
    const notificationManager = yield getContext(NOTIFICATION_MANAGER);
    yield notificationManager.showNotification({
      type: 'error',
      translateMessage: false,
      message: body,
    });
  }
}

export function* chartEditorSaga() {
  yield takeLatest(RUN_QUERY, runQuery);
}
