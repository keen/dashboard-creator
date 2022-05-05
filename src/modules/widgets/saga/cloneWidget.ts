import { cloneWidget as cloneWidgetAction } from '../actions';
import { createWidgetId } from '../utils';
import { ChartWidget, WidgetItem } from '../types';
import { all, call, put, select, take } from 'redux-saga/effects';
import { getWidget } from '../selectors';
import { appSelectors } from '../../app';

import { findBiggestYPositionOfWidgets } from '../../dashboards/utils/findBiggestYPositionOfWidgets';
import { scrollItemIntoView } from '../../../utils';
import { widgetsActions } from '../index';
import { dashboardsActions, dashboardsSelectors } from '../../dashboards';

export function* cloneWidget({
  payload,
}: ReturnType<typeof cloneWidgetAction>) {
  const { widgetId } = payload;
  const clonedWidgetId = createWidgetId();
  const widgetItem: WidgetItem = yield select(getWidget, widgetId);
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const dashboard = yield select(dashboardsSelectors.getDashboard, dashboardId);

  const widgets = yield all(
    dashboard.settings.widgets.map((id: string) => select(getWidget, id))
  );

  const {
    widget: { type },
  } = widgetItem;

  let widgetSettings = {
    ...widgetItem.widget,
    position: {
      ...widgetItem.widget.position,
      y: findBiggestYPositionOfWidgets(widgets) + 1,
    },
  };

  if (type === 'visualization') {
    widgetSettings = {
      ...widgetSettings,
      datePickerId: null,
      filterIds: [],
    } as ChartWidget;
  }

  yield put(
    widgetsActions.saveClonedWidget({
      id: clonedWidgetId,
      widgetSettings,
      widgetItem: widgetItem as WidgetItem,
    })
  );
  yield put(
    dashboardsActions.addWidgetToDashboard({
      dashboardId,
      widgetId: clonedWidgetId,
    })
  );
  yield put(dashboardsActions.saveDashboard(dashboardId));

  yield take(dashboardsActions.updateDashboardMetadata.type);
  yield call(scrollItemIntoView, clonedWidgetId);
}
