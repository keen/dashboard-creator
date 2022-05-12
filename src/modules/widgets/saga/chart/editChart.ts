import { getContext, put, select, take } from 'redux-saga/effects';
import { SET_QUERY_EVENT, SET_CHART_SETTINGS } from '@keen.io/query-creator';

import { chartEditorActions, chartEditorSelectors } from '../../../chartEditor';
import { editChartSavedQuery } from '../chartWidget';
import { appSelectors } from '../../../app';

import { PUBSUB } from '../../../../constants';
import { ChartWidget } from '../../types';
import { widgetsActions } from '../../index';
import { dashboardsActions } from '../../../dashboards';

/**
 * Flow responsible for editing single chart.
 *
 * @param id - Widget identifer
 * @param widgetItem - Widget item
 * @return void
 *
 */
export function* editChart(id: string, widgetItem: any) {
  const {
    widget,
    data: { query },
  } = widgetItem;

  const {
    query: widgetQuery,
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget as ChartWidget;
  const isSavedQuery = typeof widgetQuery === 'string';

  yield put(chartEditorActions.setQueryType(isSavedQuery));

  yield put(
    chartEditorActions.setVisualizationSettings({
      type: visualizationType,
      chartSettings,
      widgetSettings,
    })
  );
  yield put(chartEditorActions.setEditMode(true));
  yield put(chartEditorActions.setQuerySettings(query));
  yield put(chartEditorActions.setQueryResult(widgetItem.data));

  yield put(chartEditorActions.setLoading(false));

  const pubsub = yield getContext(PUBSUB);

  yield pubsub.publish(SET_QUERY_EVENT, { query });

  if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
    const { stepLabels } = chartSettings;
    yield pubsub.publish(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels },
    });
  }

  const action = yield take([
    chartEditorActions.closeEditor.type,
    chartEditorActions.applyConfiguration.type,
  ]);

  if (action.type === chartEditorActions.closeEditor.type) {
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());
  } else {
    const {
      isSavedQuery,
      visualization: { type: widgetType, chartSettings, widgetSettings },
      querySettings,
    } = yield select(chartEditorSelectors.getChartEditor);

    if (isSavedQuery) {
      yield* editChartSavedQuery(id);
    } else {
      const widgetState = {
        isInitialized: false,
        isConfigured: false,
        error: null,
        data: null,
      };

      yield put(widgetsActions.setWidgetState({ id, widgetState }));
      yield put(
        widgetsActions.finishChartWidgetConfiguration({
          id,
          query: querySettings,
          visualizationType: widgetType,
          chartSettings,
          widgetSettings,
        })
      );

      yield put(widgetsActions.initializeChartWidget(id));

      yield put(chartEditorActions.closeEditor());
      yield take(chartEditorActions.editorUnmounted.type);
      yield put(chartEditorActions.resetEditor());

      const dashboardId = yield select(appSelectors.getActiveDashboard);
      yield put(dashboardsActions.saveDashboard(dashboardId));
    }
  }
}
