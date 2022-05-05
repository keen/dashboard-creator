import { initializeDashboardWidgets as initializeDashboardWidgetsAction } from '../actions';
import { all, put } from 'redux-saga/effects';
import { widgetsActions } from '../../widgets';

export function* initializeDashboardWidgets({
  payload,
}: ReturnType<typeof initializeDashboardWidgetsAction>) {
  const { widgetsId } = payload;
  yield all(
    widgetsId.map((widgetId) => put(widgetsActions.initializeWidget(widgetId)))
  );
}
