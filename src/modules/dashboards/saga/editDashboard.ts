import { put, select, all, getContext, call } from 'redux-saga/effects';

import { push } from 'connected-react-router';

import { prepareDashboard } from './prepareDashboard';

import { getDashboard } from '../selectors';

import { appActions } from '../../app';
import {
  WidgetItem,
  FilterWidget,
  widgetsSelectors,
  widgetsActions,
} from '../../widgets';

import { DASHBOARD_API, ROUTES } from '../../../constants';

import { DashboardModel, DashboardItem } from '../types';
import { dashboardsActions } from '../index';

/**
 * Flow responsible for rendering dashboard in edit mode
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* editDashboard({
  payload,
}: ReturnType<typeof dashboardsActions.editDashboard>) {
  const { dashboardId } = payload;
  const dashboard: DashboardItem = yield select(getDashboard, dashboardId);

  if (!dashboard) {
    yield put(dashboardsActions.registerDashboard(dashboardId));

    yield put(appActions.setActiveDashboard(dashboardId));
    yield put(push(ROUTES.EDITOR));

    const dashboardApi = yield getContext(DASHBOARD_API);

    try {
      const responseBody: DashboardModel = yield dashboardApi.getDashboardById(
        dashboardId
      );

      const { widgetIds } = yield call(
        prepareDashboard,
        dashboardId,
        responseBody
      );

      yield put(
        dashboardsActions.initializeDashboardWidgets(dashboardId, widgetIds)
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    const widgets = dashboard.settings.widgets;
    if (widgets && widgets.length > 0) {
      const connectedWidgets = yield all(
        widgets.map((id: string) => select(widgetsSelectors.getWidget, id))
      );
      const filtersToReset: WidgetItem<FilterWidget>[] = connectedWidgets.filter(
        (widget: WidgetItem<FilterWidget>) => widget.widget.type === 'filter'
      );
      yield all(
        filtersToReset.map((filter) =>
          put(widgetsActions.clearFilterData({ filterId: filter.widget.id }))
        )
      );
    }
    yield put(appActions.setActiveDashboard(dashboardId));
    yield put(push(ROUTES.EDITOR));
  }
}
