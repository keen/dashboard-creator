import { getContext, put, select } from 'redux-saga/effects';
import { SET_CHART_SETTINGS, SET_QUERY_EVENT } from '@keen.io/query-creator';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';
import { PUBSUB } from '../../../constants';

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
