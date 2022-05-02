import { put, select } from 'redux-saga/effects';
import {
  initializeChartWidget as initializeChartWidgetAction,
  initializeWidget as initializeWidgetAction,
} from '../actions';
import { getWidgetSettings } from '../selectors';
import { widgetsActions } from '../index';

export function* initializeWidget({
  payload,
}: ReturnType<typeof initializeWidgetAction>) {
  const { id } = payload;
  const { type } = yield select(getWidgetSettings, id);
  if (type === 'visualization') {
    yield put(initializeChartWidgetAction(id));
  } else {
    yield put(
      widgetsActions.setWidgetState({
        id,
        widgetState: {
          isConfigured: true,
          isInitialized: true,
        },
      })
    );
  }
}
