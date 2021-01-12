import { takeLatest, put, take, select, getContext } from 'redux-saga/effects';
import {
  UPDATE_VISUALIZATION_TYPE,
  SET_CHART_SETTINGS,
  SET_QUERY_EVENT,
} from '@keen.io/query-creator';
import { isElementInViewport } from '@keen.io/ui-core';

import {
  restoreSavedQuery as restoreSavedQueryAction,
  setVisualizationSettings,
  setQueryResult,
  setQuerySettings,
  runQuerySuccess,
  runQueryError,
} from './actions';

import { getChartEditor } from './selectors';

import {
  RUN_QUERY,
  RESTORE_SAVED_QUERY,
  SET_VISUALIZATION_SETTINGS,
  OPEN_EDITOR,
  EDITOR_MOUNTED,
  QUERY_UPDATE_CONFIRMATION_MOUNTED,
  SHOW_QUERY_UPDATE_CONFIRMATION,
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

export function* showUpdateConfirmation() {
  yield take(QUERY_UPDATE_CONFIRMATION_MOUNTED);
  const element = document.getElementById('confirm-query-update');
  if (element) {
    yield scrollToElement(element);
  }
}

export function* restoreSavedQuery({
  payload,
}: ReturnType<typeof restoreSavedQueryAction>) {
  const { query } = payload;
  const pubsub = yield getContext(PUBSUB);
  const {
    visualization: { chartSettings },
  } = yield select(getChartEditor);

  if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
    const { stepLabels } = chartSettings;
    yield pubsub.publish(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels },
    });
  }

  yield put(setQuerySettings(query));
  yield pubsub.publish(SET_QUERY_EVENT, { query });

  yield put(setQueryResult(null));
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
  yield takeLatest(RESTORE_SAVED_QUERY, restoreSavedQuery);
  yield takeLatest(RUN_QUERY, runQuery);
  yield takeLatest(OPEN_EDITOR, openEditor);
  yield takeLatest(SHOW_QUERY_UPDATE_CONFIRMATION, showUpdateConfirmation);
  yield takeLatest(SET_VISUALIZATION_SETTINGS, updateVisualizationType);
}
