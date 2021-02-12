import sagaHelper from 'redux-saga-testing';
import { put } from 'redux-saga/effects';

import { updateConnection } from './actions';
import { setWidgetHighlight } from './saga';

import { setWidgetState } from '../widgets';

describe('setWidgetHighlight()', () => {
  describe('Scenario 1: Highlights widget connected with date picker', () => {
    const action = updateConnection('@widget/01', true);
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates chart widget state', (result) => {
      expect(result).toEqual(
        put(setWidgetState('@widget/01', { isHighlighted: true }))
      );
    });
  });

  describe('Scenario 2: Disables highlight for widget disconnected from date picker', () => {
    const action = updateConnection('@widget/01', false);
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates chart widget state', (result) => {
      expect(result).toEqual(
        put(setWidgetState('@widget/01', { isHighlighted: false }))
      );
    });
  });
});
