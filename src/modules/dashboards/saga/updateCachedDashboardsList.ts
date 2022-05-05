import { all, put, select } from 'redux-saga/effects';
import { getCachedDashboardIds, getDashboard } from '../selectors';
import { appSelectors } from '../../app';
import { widgetsActions } from '../../widgets';
import { dashboardsActions } from '../index';

export function* updateCachedDashboardsList({
  payload,
}: ReturnType<
  | typeof dashboardsActions.viewDashboard
  | typeof dashboardsActions.editDashboard
>) {
  const { dashboardId } = payload;
  let [...cachedDashboardIds] = yield select(getCachedDashboardIds);
  const cachedDashboardsNumber = yield select(
    appSelectors.getCachedDashboardsNumber
  );
  if (cachedDashboardIds.includes(dashboardId)) {
    cachedDashboardIds.push(
      cachedDashboardIds.splice(cachedDashboardIds.indexOf(dashboardId), 1)[0]
    );
  } else if (cachedDashboardIds.length < cachedDashboardsNumber) {
    cachedDashboardIds.push(dashboardId);
  } else {
    const dashboardToUnregister = yield select(
      getDashboard,
      cachedDashboardIds[0]
    );
    if (dashboardToUnregister.settings) {
      const widgets = dashboardToUnregister.settings.widgets;
      yield all(
        widgets.map((widgetId) =>
          put(widgetsActions.unregisterWidget({ widgetId }))
        )
      );
      yield put(dashboardsActions.unregisterDashboard(cachedDashboardIds[0]));
      cachedDashboardIds.push(dashboardId);
      cachedDashboardIds = cachedDashboardIds.splice(1, 3);
    }
  }
  yield put(dashboardsActions.updateCachedDashboardIds(cachedDashboardIds));
}
