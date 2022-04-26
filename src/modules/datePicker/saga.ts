import { takeEvery, put } from 'redux-saga/effects';

import { setWidgetState } from '../widgets';
import { datePickerActions } from './index';

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
}: ReturnType<typeof datePickerActions.updateConnection>) {
  const { widgetId, isConnected } = payload;
  yield put(
    setWidgetState(widgetId, {
      isHighlighted: isConnected,
    })
  );
}

export function* datePickerSaga() {
  yield takeEvery(datePickerActions.updateConnection, setWidgetHighlight);
}
