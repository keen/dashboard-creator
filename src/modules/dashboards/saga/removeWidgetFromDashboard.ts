import { all, call, put, select } from 'redux-saga/effects';
import { widgetsActions, widgetsSelectors } from '../../widgets';
import {
  removeConnectionFromDatePicker,
  removeDatePickerConnections,
} from '../../widgets/saga/datePickerWidget';
import {
  removeConnectionFromFilter,
  removeFilterConnections,
} from '../../widgets/saga/filterWidget';
import { updateAccessKeyOptions } from './updateAccessKeyOptions';
import { dashboardsActions } from '../index';

export function* removeWidgetFromDashboard({
  payload,
}: ReturnType<typeof dashboardsActions.removeWidgetFromDashboard>) {
  const { dashboardId, widgetId } = payload;

  const { type, query, datePickerId, filterIds } = yield select(
    widgetsSelectors.getWidgetSettings,
    widgetId
  );

  if (type === 'visualization' && query && typeof query === 'string') {
    yield call(updateAccessKeyOptions);
    if (datePickerId) {
      yield call(removeConnectionFromDatePicker, datePickerId, widgetId);
    }

    if (filterIds.length > 0) {
      yield all(
        filterIds.map((filterId: string) =>
          call(removeConnectionFromFilter, filterId, widgetId)
        )
      );
    }
  }

  if (type === 'date-picker') {
    yield call(removeDatePickerConnections, dashboardId, widgetId);
  }

  if (type === 'filter') {
    yield call(removeFilterConnections, dashboardId, widgetId);
  }

  yield put(widgetsActions.removeWidget(widgetId));
}
