import { fork, put, select, take } from 'redux-saga/effects';
import { selectImageWidget } from './imageWidget';
import { setupDatePicker } from './datePickerWidget';
import { createTextWidget } from './textWidget';
import { appSelectors } from '../../app';
import { setupFilterWidget } from './filterWidget';
import { selectQueryForWidget } from './selectQueryForWidget';
import { widgetsActions } from '../index';
import { dashboardsActions } from '../../dashboards';

export function* createWidget({
  payload,
}: ReturnType<typeof widgetsActions.createWidget>) {
  const { id, widgetType } = payload;
  if (widgetType === 'image') {
    yield fork(selectImageWidget, id);
  } else if (widgetType === 'date-picker') {
    yield fork(setupDatePicker, id);
  } else if (widgetType === 'text') {
    yield fork(createTextWidget, id);
    yield take(dashboardsActions.addWidgetToDashboard.type);
    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(dashboardsActions.saveDashboard(dashboardId));
  } else if (widgetType === 'filter') {
    yield fork(setupFilterWidget, id);
  } else {
    yield fork(selectQueryForWidget, id);
  }
}
