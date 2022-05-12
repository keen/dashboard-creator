import { call, put, take } from 'redux-saga/effects';
import { appActions } from '../../app';
import { queriesActions } from '../../queries';
import { cancelWidgetConfiguration } from './cancelWidgetConfiguration';
import { createQueryForWidget } from './createQueryForWidget';
import { selectSavedQueryForWidget } from './selectSavedQueryForWidget';

/**
 * Initial flow for creating chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* selectQueryForWidget(widgetId: string) {
  yield put(appActions.showQueryPicker());
  const action = yield take([
    queriesActions.selectSavedQuery.type,
    queriesActions.createQuery.type,
    appActions.hideQueryPicker.type,
  ]);

  if (action.type === appActions.hideQueryPicker.type) {
    yield* cancelWidgetConfiguration(widgetId);
  } else if (action.type === queriesActions.createQuery.type) {
    yield put(appActions.hideQueryPicker());
    yield call(createQueryForWidget, widgetId);
  } else if (action.type === queriesActions.selectSavedQuery.type) {
    yield put(appActions.hideQueryPicker());
    yield call(selectSavedQueryForWidget, action.payload.query, widgetId);
  }
}
