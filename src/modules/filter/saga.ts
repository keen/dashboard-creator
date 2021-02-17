import { put, takeEvery } from 'redux-saga/effects';
import { UPDATE_CONNECTION } from './constants';
import { updateConnection } from '../datePicker';
import { setWidgetState } from '../widgets';

/**
 * Set highlight state for widget during date picker configuration
 *
 * @param widgetId - Widget identifer
 * @param isConnected - connection state
 * @return void
 *
 */
export function* setWidgetHighlight({
  payload,
}: ReturnType<typeof updateConnection>) {
  const { widgetId, isConnected } = payload;
  yield put(
    setWidgetState(widgetId, {
      isHighlighted: isConnected,
    })
  );
}

export function* filterSaga() {
  yield takeEvery(UPDATE_CONNECTION, setWidgetHighlight);
}
