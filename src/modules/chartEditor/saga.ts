import { takeLatest, put, take, select, getContext } from 'redux-saga/effects';
import deepEqual from 'deep-equal';
import {
  UPDATE_VISUALIZATION_TYPE,
  SET_CHART_SETTINGS,
  SET_QUERY_EVENT,
} from '@keen.io/query-creator';
import { isElementInViewport } from '@keen.io/ui-core';

import { chartEditorActions, chartEditorSelectors } from './index';

import { KEEN_ANALYSIS, NOTIFICATION_MANAGER, PUBSUB } from '../../constants';

import { EditorSection } from './types';

function* scrollToElement(element: HTMLElement) {
  if (element && !isElementInViewport(element)) {
    yield element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}

export function* openEditor() {
  yield take(chartEditorActions.editorMounted.type);
  const element = document.getElementById('chart-editor');

  if (element) {
    yield scrollToElement(element);
  }
}

export function* updateVisualizationType({
  payload,
}: ReturnType<typeof chartEditorActions.setVisualizationSettings>) {
  const { type } = payload;
  const pubsub = yield getContext(PUBSUB);
  yield pubsub.publish(UPDATE_VISUALIZATION_TYPE, { type });
}

export function* showUpdateConfirmation() {
  yield take(chartEditorActions.queryUpdateConfirmationMounted.type);
  const element = document.getElementById('confirm-query-update');
  if (element) {
    yield scrollToElement(element);
  }
}

export function* updateEditorSection({
  payload: editorSection,
}: ReturnType<typeof chartEditorActions.setEditorSection>) {
  if (editorSection === EditorSection.QUERY) {
    yield take(chartEditorActions.editorMounted.type);
    const pubsub = yield getContext(PUBSUB);
    const {
      querySettings,
      visualization: { chartSettings },
    } = yield select(chartEditorSelectors.getChartEditor);

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
  } = yield select(chartEditorSelectors.getChartEditor);

  if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
    const { stepLabels } = chartSettings;
    yield pubsub.publish(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels },
    });
  }

  yield put(chartEditorActions.setQuerySettings(initialQuerySettings));
  yield pubsub.publish(SET_QUERY_EVENT, { query: initialQuerySettings });

  yield put(chartEditorActions.setQueryResult(null));
}

/**
 * Flow responsible for comparing root query with updated settings.
 *
 * @param query - Updated query structure
 * @return void
 *
 */
export function* updateQuerySettings({
  payload: query,
}: ReturnType<typeof chartEditorActions.setQuerySettings>) {
  const { initialQuerySettings } = yield select(
    chartEditorSelectors.getChartEditor
  );
  if (initialQuerySettings) {
    const hasQueryChanged = !deepEqual(initialQuerySettings, query, {
      strict: true,
    });
    yield put(chartEditorActions.setQueryChange(hasQueryChanged));
  }
}

/**
 * Flow responsible for executing query in chart editor
 *
 * @return void
 *
 */
export function* runQuery() {
  const { querySettings } = yield select(chartEditorSelectors.getChartEditor);
  const keenAnalysis = yield getContext(KEEN_ANALYSIS);

  try {
    let analysisResult = yield keenAnalysis.query(querySettings);

    /** Funnel analysis do not return query settings in response */
    if (querySettings.analysis_type === 'funnel') {
      analysisResult = {
        ...analysisResult,
        query: querySettings,
      };
    }

    yield put(chartEditorActions.runQuerySuccess(analysisResult));
  } catch (error) {
    const { body } = error;
    yield put(chartEditorActions.runQueryError(body));
    const notificationManager = yield getContext(NOTIFICATION_MANAGER);
    yield notificationManager.showNotification({
      type: 'error',
      translateMessage: false,
      message: body,
    });
  }
}

export function* chartEditorSaga() {
  yield takeLatest(
    chartEditorActions.setEditorSection.type,
    updateEditorSection
  );
  yield takeLatest(
    chartEditorActions.restoreSavedQuery.type,
    restoreSavedQuery
  );
  yield takeLatest(
    chartEditorActions.setQuerySettings.type,
    updateQuerySettings
  );
  yield takeLatest(chartEditorActions.runQuery.type, runQuery);
  yield takeLatest(chartEditorActions.openEditor.type, openEditor);
  yield takeLatest(
    chartEditorActions.showQueryUpdateConfirmation.type,
    showUpdateConfirmation
  );
  yield takeLatest(
    chartEditorActions.setVisualizationSettings.type,
    updateVisualizationType
  );
}
