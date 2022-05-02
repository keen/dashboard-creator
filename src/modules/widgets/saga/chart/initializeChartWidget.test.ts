/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { put, call, getContext, select } from 'redux-saga/effects';

import {
  prepareChartWidgetQuery,
  checkIfChartWidgetHasInconsistentFilters,
} from '../chartWidget';

import { initializeChartWidget } from './initializeChartWidget';

import { widgetsSelectors } from '../../selectors';
import { serializeWidget } from '../../serializers';

import { KEEN_ANALYSIS } from '../../../../constants';

import { WidgetErrors } from '../../types';
import { queriesActions, queriesSelectors } from '../../../queries';
import { widgetsActions } from '../../index';

describe('initializeChartWidget()', () => {
  const widgetId = '@widget/01';

  describe('Scenario 1: Initializes chart widget build with saved query', () => {
    const action = widgetsActions.initializeChartWidget(widgetId);
    const test = sagaHelper(initializeChartWidget(action));

    const keenAnalysis = {
      query: jest.fn(),
    };

    const chartWidget = serializeWidget({
      id: '@widget/01',
      type: 'visualization',
      position: { x: 0, y: 0, w: 5, h: 3 },
      query: 'logins',
      datePickerId: null,
      filterIds: [],
      settings: {
        visualizationType: 'metric',
        chartSettings: {},
        widgetSettings: {},
      },
    });

    const analysisResult = {
      result: 10,
      metadata: {
        visualization: {
          type: 'bar',
          chart_settings: { stack_mode: 'percent', group_mode: 'stacked' },
          widget_settings: {},
        },
      },
      query: {
        analysis_type: 'count',
      },
    };

    test('gets widget settings', (result) => {
      expect(result).toEqual(select(widgetsSelectors.getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query: 'logins', hasQueryModifiers: false };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(
        put(widgetsActions.setWidgetLoading({ id: widgetId, isLoading: true }))
      );
    });

    test('check if chart widget has inconsistent filters', (result) => {
      expect(result).toEqual(
        call(checkIfChartWidgetHasInconsistentFilters, chartWidget)
      );
      return false;
    });

    test('gets Keen API client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith({
        savedQueryName: 'logins',
      });

      return analysisResult;
    });

    test('gets interim query connected with widget', (result) => {
      expect(result).toEqual(
        select(queriesSelectors.getInterimQuery, widgetId)
      );

      return undefined;
    });

    test('set chart widget visualization', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setChartWidgetVisualization({
            id: widgetId,
            visualizationType: 'bar',
            chartSettings: {
              groupMode: 'stacked',
              stackMode: 'percent',
            },
            widgetSettings: {},
          })
        )
      );
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: {
              isInitialized: true,
              data: analysisResult,
            },
          })
        )
      );
    });
  });

  describe('Scenario 2: Initializes chart widget with saved query and active date picker', () => {
    const action = widgetsActions.initializeChartWidget(widgetId);
    const test = sagaHelper(initializeChartWidget(action));

    const keenAnalysis = {
      query: jest.fn(),
    };

    const query = {
      analysis_type: 'count',
      event_collection: 'logins',
    };

    const chartWidget: any = {
      widget: {
        query,
        datePickerId: '@datepicker/01',
        filterIds: [],
        settings: {
          visualizationType: 'metric',
        },
      },
    };

    const analysisResult = {
      result: 10,
      query,
    };

    test('gets widget settings', (result) => {
      expect(result).toEqual(select(widgetsSelectors.getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query, hasQueryModifiers: true };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(
        put(widgetsActions.setWidgetLoading({ id: widgetId, isLoading: true }))
      );
    });

    test('check if chart widget has inconsistent filters', (result) => {
      expect(result).toEqual(
        call(checkIfChartWidgetHasInconsistentFilters, chartWidget)
      );
      return false;
    });

    test('gets Keen API client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith(query);

      return analysisResult;
    });

    test('add interim query for chart widget', (result) => {
      expect(result).toEqual(
        put(queriesActions.addInterimQuery({ widgetId, data: analysisResult }))
      );
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: {
              isInitialized: true,
            },
          })
        )
      );
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(
        put(widgetsActions.setWidgetLoading({ id: widgetId, isLoading: false }))
      );
    });
  });

  describe('Scenario 3: Failed to initialize chart widget', () => {
    const action = widgetsActions.initializeChartWidget(widgetId);
    const test = sagaHelper(initializeChartWidget(action));

    const keenAnalysis = {
      query: jest.fn(),
    };

    const errorBody = '@error-body';
    const chartWidget: any = {
      widget: {
        query: 'purchases',
        datePickerId: null,
        settings: {
          visualizationType: 'bar',
        },
      },
    };

    test('gets widget settings', (result) => {
      expect(result).toEqual(select(widgetsSelectors.getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query: 'purchases', hasQueryModifiers: false };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(
        put(widgetsActions.setWidgetLoading({ id: widgetId, isLoading: true }))
      );
    });

    test('check if chart widget has inconsistent filters', (result) => {
      expect(result).toEqual(
        call(checkIfChartWidgetHasInconsistentFilters, chartWidget)
      );
      return false;
    });

    test('gets Keen API client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith({
        savedQueryName: 'purchases',
      });

      const error = new Error();
      (error as any).body = errorBody;

      return error;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: {
              isInitialized: true,
              error: {
                message: errorBody,
                code: WidgetErrors.CANNOT_INITIALIZE,
              },
            },
          })
        )
      );
    });
  });

  describe('Scenario 4: Active filters are inconsistent with query', () => {
    const action = widgetsActions.initializeChartWidget(widgetId);
    const test = sagaHelper(initializeChartWidget(action));

    const query = {
      analysis_type: 'count',
      event_collection: 'logins',
    };

    const chartWidget: any = {
      data: {
        query,
      },
      widget: {
        query: query,
        datePickerId: null,
        filterIds: ['@filter/01', '@filter/02'],
        settings: {
          visualizationType: 'metric',
        },
      },
    };

    test('gets widget settings', (result) => {
      expect(result).toEqual(select(widgetsSelectors.getWidget, widgetId));
      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query, hasQueryModifiers: true };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(
        put(widgetsActions.setWidgetLoading({ id: widgetId, isLoading: true }))
      );
    });

    test('check if chart widget has inconsistent filters', (result) => {
      expect(result).toEqual(
        call(checkIfChartWidgetHasInconsistentFilters, chartWidget)
      );
      return true;
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(
        put(widgetsActions.setWidgetLoading({ id: widgetId, isLoading: false }))
      );
    });
  });
});
