import { takeEvery, put } from 'redux-saga/effects';

import { updateConnection } from './actions';

import { setWidgetState } from '../widgets';

import { UPDATE_CONNECTION } from './constants';

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

export function* datePickerSaga() {
  yield takeEvery(UPDATE_CONNECTION, setWidgetHighlight);
}
