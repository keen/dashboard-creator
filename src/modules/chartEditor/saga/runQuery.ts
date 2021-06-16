import { getContext, put, select } from 'redux-saga/effects';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';
import { KEEN_ANALYSIS, NOTIFICATION_MANAGER } from '../../../constants';

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
