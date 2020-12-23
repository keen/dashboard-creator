import { takeLatest, put, select, getContext } from 'redux-saga/effects';

import { runQuerySuccess, runQueryError } from './actions';

import { getChartEditor } from './selectors';

import { RUN_QUERY } from './constants';
import { KEEN_ANALYSIS } from '../../constants';

function* runQuery() {
  const { querySettings } = yield select(getChartEditor);
  const keenAnalysis = yield getContext(KEEN_ANALYSIS);

  try {
    const analysisResult = yield keenAnalysis.query(querySettings);
    yield put(runQuerySuccess(analysisResult));
  } catch (err) {
    yield put(runQueryError());
    console.error(err);
  }
}

export function* chartEditorSaga() {
  yield takeLatest(RUN_QUERY, runQuery);
}
