import { all, call, put, select, take } from 'redux-saga/effects';
import {
  createWidgetId,
  widgetsActions,
  widgetsSelectors,
} from '../../widgets';
import { getDroppingItemSize, scrollItemIntoView } from '../../../utils';
import { findBiggestYPositionOfWidgets } from '../utils/findBiggestYPositionOfWidgets';
import { dashboardsActions, dashboardsSelectors } from '../index';

export function* calculateYPositionAndAddWidget({
  payload,
}: ReturnType<typeof dashboardsActions.calculateYPositionAndAddWidget>) {
  const { dashboardId, widgetType } = payload;
  const dashboard = yield select(dashboardsSelectors.getDashboard, dashboardId);

  const widgets = yield all(
    dashboard.settings.widgets.map((id: string) =>
      select(widgetsSelectors.getWidget, id)
    )
  );

  const widgetId = createWidgetId();
  const { w, h, minH, minW } = getDroppingItemSize(widgetType);

  yield put(
    widgetsActions.createWidget({
      id: widgetId,
      widgetType,
      gridPosition: {
        x: 0,
        y: findBiggestYPositionOfWidgets(widgets) + 1,
        w,
        h,
        minW,
        minH,
      },
    })
  );
  yield put(dashboardsActions.addWidgetToDashboard({ dashboardId, widgetId }));

  yield take(dashboardsActions.updateDashboardMetadata.type);
  yield call(scrollItemIntoView, widgetId);
}
