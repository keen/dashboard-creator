import { setupDashboardEventStreams as setupDashboardEventStreamsAction } from '../actions';
import { put, select } from 'redux-saga/effects';
import { filterActions } from '../index';
import { widgetsSelectors } from '../../widgets';
import { dashboardsSelectors } from '../../dashboards';

/**
 * Set event streams used on dashboard
 *
 * @param dashboardId - Dashboard identifer
 * @return void
 *
 */
export function* setupDashboardEventStreams({
  payload,
}: ReturnType<typeof setupDashboardEventStreamsAction>) {
  const { dashboardId } = payload;

  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = dashboardsSelectors.getDashboard(state, dashboardId);

  const eventStreams = new Set<string>();

  widgetsIds
    .map((widgetId) => widgetsSelectors.getWidget(state, widgetId))
    .filter(({ widget: { type } }) => type === 'visualization')
    .map(({ data }) => data?.query?.event_collection)
    .forEach((eventStream) => {
      if (eventStream) eventStreams.add(eventStream);
    });

  yield put(filterActions.setEventStreamsPool([...eventStreams]));
}
