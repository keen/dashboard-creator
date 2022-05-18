import sagaHelper from 'redux-saga-testing';
import { put } from 'redux-saga/effects';
import { setWidgetHighlight } from './setWidgetHighlight';
import { filterActions } from '../index';
import { widgetsActions } from '../../widgets';

describe('setWidgetHighlight()', () => {
  describe('Scenario 1: Set highlight state after enabling widget connection ', () => {
    const action = filterActions.updateConnection({
      widgetId: '@widget/01',
      isConnected: true,
    });
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates widget highlight state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: '@widget/01',
            widgetState: {
              isHighlighted: true,
            },
          })
        )
      );
    });
  });

  describe('Scenario 2: Set highlight state after removing widget connection ', () => {
    const action = filterActions.updateConnection({
      widgetId: '@widget/01',
      isConnected: false,
    });
    const test = sagaHelper(setWidgetHighlight(action));

    test('updates widget highlight state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: '@widget/01',
            widgetState: {
              isHighlighted: false,
            },
          })
        )
      );
    });
  });
});
