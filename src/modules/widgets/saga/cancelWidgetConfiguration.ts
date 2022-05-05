import { put, select } from 'redux-saga/effects';
import { appSelectors } from '../../app';
import { dashboardsActions } from '../../dashboards';

export function* cancelWidgetConfiguration(widgetId: string) {
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  yield put(
    dashboardsActions.removeWidgetFromDashboard({ dashboardId, widgetId })
  );
}
