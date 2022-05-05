import { SavedQuery } from '../../queries';
import { put, select } from 'redux-saga/effects';
import { initializeChartWidget as initializeChartWidgetAction } from '../actions';
import { appSelectors } from '../../app';
import { widgetsActions } from '../index';
import { dashboardsActions } from '../../dashboards';

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
  yield put(dashboardsActions.updateAccessKeyOptions());

  const dashboardId = yield select(appSelectors.getActiveDashboard);
  yield put(dashboardsActions.saveDashboard(dashboardId));
}
