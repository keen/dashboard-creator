import { put } from 'redux-saga/effects';
import { filterActions } from '../index';
import { widgetsActions } from '../../widgets';

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
    widgetsActions.setWidgetState({
      id: widgetId,
      widgetState: {
        isHighlighted: isConnected,
      },
    })
  );
}
