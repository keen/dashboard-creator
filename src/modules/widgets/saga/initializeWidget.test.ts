import {
  initializeChartWidget as initializeChartWidgetAction,
  initializeWidget as initializeWidgetAction,
} from '../actions';
import sagaHelper from 'redux-saga-testing';
import { put, select } from 'redux-saga/effects';
import { getWidgetSettings } from '../selectors';
import { initializeWidget } from './initializeWidget';

const widgetId = '@widget/01';

describe('initializeWidget()', () => {
  const action = initializeWidgetAction(widgetId);

  describe('Scenario 1: User initializes visualization widget', () => {
    const test = sagaHelper(initializeWidget(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        type: 'visualization',
      };
    });

    test('initializes visualization widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });
});
