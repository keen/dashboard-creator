import { put, select, take } from 'redux-saga/effects';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';
import { initializeChartWidget as initializeChartWidgetAction } from '../actions';
import { appSelectors } from '../../app';
import { cancelWidgetConfiguration } from './cancelWidgetConfiguration';
import { widgetsActions } from '../index';
import { dashboardsActions } from '../../dashboards';

/**
 * Flow responsible for creating ad-hoc query for chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createQueryForWidget(
  widgetId: string,
  isExistingWidget = false
) {
  yield put(chartEditorActions.openEditor());
  const action = yield take([
    chartEditorActions.closeEditor.type,
    chartEditorActions.applyConfiguration.type,
  ]);

  if (action.type === chartEditorActions.closeEditor.type) {
    if (isExistingWidget) {
      yield put(chartEditorActions.closeEditor());
    } else {
      yield* cancelWidgetConfiguration(widgetId);
    }
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());
  } else {
    const {
      querySettings,
      visualization: { type, chartSettings, widgetSettings },
    } = yield select(chartEditorSelectors.getChartEditor);

    yield put(
      widgetsActions.finishChartWidgetConfiguration({
        id: widgetId,
        query: querySettings,
        visualizationType: type,
        chartSettings,
        widgetSettings,
      })
    );

    yield put(chartEditorActions.closeEditor());
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());

    if (isExistingWidget) {
      yield put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isInitialized: false, error: null },
        })
      );
    }

    yield put(initializeChartWidgetAction(widgetId));

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(dashboardsActions.saveDashboard(dashboardId));
  }
}
