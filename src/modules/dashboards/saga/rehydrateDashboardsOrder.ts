import { DASHBOARD_LIST_ORDER_KEY } from '../constants';
import { put } from 'redux-saga/effects';
import { dashboardsActions } from '../index';

export function* rehydrateDashboardsOrder() {
  try {
    const settings = localStorage.getItem(DASHBOARD_LIST_ORDER_KEY);
    if (settings) {
      const { order } = JSON.parse(settings);
      yield put(dashboardsActions.setDashboardListOrder({ order }));
    }
  } catch (err) {
    console.error(err);
  }
}
