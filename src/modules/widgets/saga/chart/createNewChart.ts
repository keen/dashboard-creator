import { createNewChart as createNewChartAction } from '../../actions';
import { call, put, take } from 'redux-saga/effects';
import { appActions } from '../../../app';
import { queriesActions } from '../../../queries';
import { createQueryForWidget } from '../createQueryForWidget';
import { selectSavedQueryForWidget } from '../selectSavedQueryForWidget';

export function* createNewChart({
  payload,
}: ReturnType<typeof createNewChartAction>) {
  const { widgetId } = payload;

  yield put(appActions.showQueryPicker());
  const action = yield take([
    queriesActions.selectSavedQuery.type,
    queriesActions.createQuery.type,
    appActions.hideQueryPicker.type,
  ]);

  if (action.type === appActions.hideQueryPicker.type) {
    yield put(appActions.hideQueryPicker());
  } else if (action.type === queriesActions.createQuery.type) {
    yield put(appActions.hideQueryPicker());
    yield call(createQueryForWidget, widgetId, true);
  } else if (action.type === queriesActions.selectSavedQuery.type) {
    yield put(appActions.hideQueryPicker());
    yield call(selectSavedQueryForWidget, action.payload.query, widgetId, true);
  }
}
