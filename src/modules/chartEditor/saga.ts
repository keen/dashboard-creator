import { takeLatest, put, take, select, getContext } from 'redux-saga/effects';
import { UPDATE_VISUALIZATION_TYPE } from '@keen.io/query-creator';
import { isElementInViewport } from '@keen.io/ui-core';

import {
  setVisualizationSettings,
  runQuerySuccess,
  runQueryError,
} from './actions';

import { getChartEditor } from './selectors';

import {
  RUN_QUERY,
  SET_VISUALIZATION_SETTINGS,
  OPEN_EDITOR,
  EDITOR_MOUNTED,
} from './constants';
import { KEEN_ANALYSIS, NOTIFICATION_MANAGER, PUBSUB } from '../../constants';

function* scrollToElement(element: HTMLElement) {
  if (element && !isElementInViewport(element)) {
    yield element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}

export function* openEditor() {
  yield take(EDITOR_MOUNTED);
  const element = document.getElementById('chart-editor');

  if (element) {
    yield scrollToElement(element);
  }
}

export function* updateVisualizationType({
  payload,
}: ReturnType<typeof setVisualizationSettings>) {
  const { type } = payload;
  const pubsub = yield getContext(PUBSUB);
  yield pubsub.publish(UPDATE_VISUALIZATION_TYPE, { type });
}

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
  yield takeLatest(OPEN_EDITOR, openEditor);
  yield takeLatest(SET_VISUALIZATION_SETTINGS, updateVisualizationType);
}
