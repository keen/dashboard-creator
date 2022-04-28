import { put } from 'redux-saga/effects';
import { setWidgetState } from '../../widgets';
import { filterActions } from '../index';

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
}: ReturnType<typeof filterActions.updateConnection>) {
  const { widgetId, isConnected } = payload;
  yield put(
    setWidgetState(widgetId, {
      isHighlighted: isConnected,
    })
  );
}
