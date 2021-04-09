import { takeLatest, put, take, select, getContext } from 'redux-saga/effects';
import deepEqual from 'deep-equal';
import {
  UPDATE_VISUALIZATION_TYPE,
  SET_CHART_SETTINGS,
  SET_QUERY_EVENT,
} from '@keen.io/query-creator';
import { isElementInViewport } from '@keen.io/ui-core';

import {
  setVisualizationSettings,
  setQueryChange,
  setQueryResult,
  setQuerySettings,
  runQuerySuccess,
  runQueryError,
  setEditorSection,
} from './actions';

import { getChartEditor } from './selectors';

import {
  RUN_QUERY,
  RESTORE_SAVED_QUERY,
  SET_VISUALIZATION_SETTINGS,
  SET_QUERY_SETTINGS,
  OPEN_EDITOR,
  EDITOR_MOUNTED,
  QUERY_UPDATE_CONFIRMATION_MOUNTED,
  SHOW_QUERY_UPDATE_CONFIRMATION,
  SET_EDITOR_SECTION,
} from './constants';
import { KEEN_ANALYSIS, NOTIFICATION_MANAGER, PUBSUB } from '../../constants';

import { EditorSection } from './types';

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

export function* updateEditorSection({
  payload,
}: ReturnType<typeof setEditorSection>) {
  const { editorSection } = payload;

  if (editorSection === EditorSection.QUERY) {
    yield take(EDITOR_MOUNTED);
    const pubsub = yield getContext(PUBSUB);
    const {
      querySettings,
      visualization: { chartSettings },
    } = yield select(getChartEditor);

    if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
      const { stepLabels } = chartSettings;
      yield pubsub.publish(SET_CHART_SETTINGS, {
        chartSettings: { stepLabels },
      });
    }

    yield pubsub.publish(SET_QUERY_EVENT, { query: querySettings });
  }
}

/**
 * Flow responsible for restoring initial query settings in chart editor
 *
 * @return void
 *
 */
export function* restoreSavedQuery() {
  const pubsub = yield getContext(PUBSUB);
  const {
    initialQuerySettings,
    visualization: { chartSettings },
  } = yield select(getChartEditor);

  if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
    const { stepLabels } = chartSettings;
    yield pubsub.publish(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels },
    });
  }

  yield put(setQuerySettings(initialQuerySettings));
  yield pubsub.publish(SET_QUERY_EVENT, { query: initialQuerySettings });

  yield put(setQueryResult(null));
}

/**
 * Flow responsible for comparing root query with updated settings.
 *
 * @param query - Updated query structure
 * @return void
 *
 */
export function* updateQuerySettings({
  payload,
}: ReturnType<typeof setQuerySettings>) {
  const { query } = payload;
  const { initialQuerySettings } = yield select(getChartEditor);

  if (initialQuerySettings) {
    const hasQueryChanged = !deepEqual(initialQuerySettings, query, {
      strict: true,
    });
    yield put(setQueryChange(hasQueryChanged));
  }
}

/**
 * Flow responsible for executing query in chart editor
 *
 * @return void
 *
 */
export function* runQuery() {
  const { querySettings } = yield select(getChartEditor);
  const keenAnalysis = yield getContext(KEEN_ANALYSIS);

  try {
    const analysisResult = yield keenAnalysis.query(querySettings);
    yield put(runQuerySuccess(analysisResult));
  } catch (error) {
    const { body } = error;
    yield put(runQueryError(body));
    const notificationManager = yield getContext(NOTIFICATION_MANAGER);
    yield notificationManager.showNotification({
      type: 'error',
      translateMessage: false,
      message: body,
    });
  }
}

export function* chartEditorSaga() {
  yield takeLatest(SET_EDITOR_SECTION, updateEditorSection);
  yield takeLatest(RESTORE_SAVED_QUERY, restoreSavedQuery);
  yield takeLatest(SET_QUERY_SETTINGS, updateQuerySettings);
  yield takeLatest(RUN_QUERY, runQuery);
  yield takeLatest(OPEN_EDITOR, openEditor);
  yield takeLatest(SHOW_QUERY_UPDATE_CONFIRMATION, showUpdateConfirmation);
  yield takeLatest(SET_VISUALIZATION_SETTINGS, updateVisualizationType);
}
