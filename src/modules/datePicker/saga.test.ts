import sagaHelper from 'redux-saga-testing';
import { put } from 'redux-saga/effects';

import { setWidgetHighlight } from './saga';
import { datePickerActions } from './index';
import { widgetsActions } from '../widgets';

describe('setWidgetHighlight()', () => {
  describe('Scenario 1: Highlights widget connected with date picker', () => {
    const action = datePickerActions.updateConnection({
      widgetId: '@widget/01',
      isConnected: true,
    });
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates chart widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: '@widget/01',
            widgetState: { isHighlighted: true },
          })
        )
      );
    });
  });

  describe('Scenario 2: Disables highlight for widget disconnected from date picker', () => {
    const action = datePickerActions.updateConnection({
      widgetId: '@widget/01',
      isConnected: false,
    });
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates chart widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: '@widget/01',
            widgetState: { isHighlighted: false },
          })
        )
      );
    });
  });
});
