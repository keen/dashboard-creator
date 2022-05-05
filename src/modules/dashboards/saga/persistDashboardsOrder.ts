import { DASHBOARD_LIST_ORDER_KEY } from '../constants';
import { dashboardsActions } from '../index';

export function* persistDashboardsOrder({
  payload,
}: ReturnType<typeof dashboardsActions.setDashboardListOrder>) {
  const { order } = payload;
  try {
    localStorage.setItem(DASHBOARD_LIST_ORDER_KEY, JSON.stringify({ order }));
  } catch (err) {
    console.error(err);
  }
}
