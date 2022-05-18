import {
  initializeChartWidget as initializeChartWidgetAction,
  savedQueryUpdated,
} from '../actions';
import { all, put, select } from 'redux-saga/effects';
import { appSelectors } from '../../app';
import { WidgetItem } from '../types';
import { getWidgetSettings } from '../selectors';
import { widgetsActions } from '../index';
import { dashboardsSelectors } from '../../dashboards';

/**
 * Flow responsible for re-initializing widgets after updating saved query.
 *
 * @param queryId - Saved query identifer
 * @return void
 *
 */
export function* reinitializeWidgets({
  payload,
}: ReturnType<typeof savedQueryUpdated>) {
  const { widgetId, queryId } = payload;
  const dashboardId = yield select(appSelectors.getActiveDashboard);

  const { widgets } = yield select(
    dashboardsSelectors.getDashboardSettings,
    dashboardId
  );
  const widgetState: Partial<WidgetItem> = {
    isInitialized: false,
    error: null,
    data: null,
  };

  const widgetsSettings = yield all(
    widgets.map((id: string) => select(getWidgetSettings, id))
  );

  const widgetsToUpdate = widgetsSettings.filter(
    ({ id, type, query }) =>
      id !== widgetId && type === 'visualization' && query === queryId
  );

  yield all(
    widgetsToUpdate.map(({ id }) =>
      put(widgetsActions.setWidgetState({ id, widgetState }))
    )
  );

  yield all(
    widgetsToUpdate.map(({ id }) => put(initializeChartWidgetAction(id)))
  );
}
