import { SavedQuery } from '../../queries';
import { put, select } from 'redux-saga/effects';
import { initializeChartWidget as initializeChartWidgetAction } from '../actions';
import { saveDashboard, updateAccessKeyOptions } from '../../dashboards';
import { appSelectors } from '../../app';
import { widgetsActions } from '../index';

export function* selectSavedQueryForWidget(
  query: SavedQuery,
  widgetId: string,
  isExistingWidget = false
) {
  const {
    id: queryId,
    visualization: { type: widgetType, chartSettings, widgetSettings },
  } = query;

  yield put(
    widgetsActions.finishChartWidgetConfiguration({
      id: widgetId,
      query: queryId,
      visualizationType: widgetType,
      chartSettings,
      widgetSettings,
    })
  );

  if (isExistingWidget) {
    yield put(
      widgetsActions.setWidgetState({
        id: widgetId,
        widgetState: { isInitialized: false, error: null },
      })
    );
  }

  yield put(initializeChartWidgetAction(widgetId));
  yield put(updateAccessKeyOptions());

  const dashboardId = yield select(appSelectors.getActiveDashboard);
  yield put(saveDashboard(dashboardId));
}
