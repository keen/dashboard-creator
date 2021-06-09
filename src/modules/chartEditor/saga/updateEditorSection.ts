import {
  chartEditorActions,
  chartEditorSelectors,
  EditorSection,
} from '../index';
import { getContext, select, take } from 'redux-saga/effects';
import { PUBSUB } from '../../../constants';
import {
  SET_CHART_SETTINGS,
  SET_QUERY_EVENT,
} from '@keen.io/query-creator/dist';

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
