import { getContext, put } from 'redux-saga/effects';
import { DASHBOARD_API } from '../../../constants';
import { dashboardsActions } from '../index';

export function* fetchDashboardList() {
  const dashboardApi = yield getContext(DASHBOARD_API);

  try {
    const responseBody = yield dashboardApi.getDashboards();
    yield put(dashboardsActions.fetchDashboardsListSuccess(responseBody));
  } catch (err) {
    yield put(dashboardsActions.fetchDashboardListError());
  }
}
