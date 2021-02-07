/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, call, getContext, select } from 'redux-saga/effects';
import { Query } from '@keen.io/query';

import {
  initializeChartWidget,
  prepareChartWidgetQuery,
  handleDetachedQuery,
} from './chartWidget';

import {
  initializeChartWidget as initializeChartWidgetAction,
  setWidgetState,
  setWidgetLoading,
} from '../actions';
import { getWidget } from '../selectors';

import { addInterimQuery, getInterimQuery } from '../../queries';

import { widget as widgetFixture } from '../fixtures';

import { KEEN_ANALYSIS } from '../../../constants';

import { WidgetItem } from '../types';

describe('prepareChartWidgetQuery()', () => {
  function* wrapper(widget: WidgetItem) {
    const result = yield* prepareChartWidgetQuery(widget);
    return result;
  }

  describe('Scenario 1: Prepares save query without modifiers', () => {
    const chartWidget = {
      ...widgetFixture,
      widget: {
        ...widgetFixture.widget,
        query: 'purchases',
      },
    };

    const test = sagaHelper(wrapper(chartWidget));

    test('returns saved query without modifiers', (result) => {
      expect(result).toEqual({ query: 'purchases', hasQueryModifiers: false });
    });
  });

  describe('Scenario 2: Prepares query with date and timezone modifiers', () => {
    const query = {
      analysis_type: 'count',
      event_collection: 'logins',
    } as Query;

    const chartWidget = {
      ...widgetFixture,
      data: {
        query,
      },
      widget: {
        ...widgetFixture.widget,
        datePickerId: '@date-picker/01',
        query,
      },
    };

    const test = sagaHelper(wrapper(chartWidget));

    test('get date picker widget settings', (result) => {
      expect(result).toEqual(select(getWidget, '@date-picker/01'));

      return {
        isActive: true,
        data: { timeframe: 'this_30_days', timezone: 'US/Central' },
      };
    });

    test('returns query modifiers', (result) => {
      expect(result).toEqual({
        query: {
          analysis_type: 'count',
          event_collection: 'logins',
          timeframe: 'this_30_days',
          timezone: 'US/Central',
        },
        hasQueryModifiers: true,
      });
    });
  });

  describe('Scenario 3: Returns initial query for non-active modifiers', () => {
    const query = {
      analysis_type: 'count',
      event_collection: 'logins',
    } as Query;

    const chartWidget = {
      ...widgetFixture,
      widget: {
        ...widgetFixture.widget,
        datePickerId: '@date-picker/01',
        query,
      },
    };

    const test = sagaHelper(wrapper(chartWidget));

    test('get date picker widget settings', (result) => {
      expect(result).toEqual(select(getWidget, '@date-picker/01'));

      return {
        isActive: false,
        data: { timeframe: 'this_30_days', timezone: 'US/Central' },
      };
    });

    test('returns query without modifiers', (result) => {
      expect(result).toEqual({ query, hasQueryModifiers: false });
    });
  });

  describe('Scenario 4: Prepares funnel steps with date and timezone modifiers', () => {
    const query = {
      analysis_type: 'funnel',
    } as Query;

    const steps = [
      {
        event_collection: 'logins',
        timeframe: 'this_14_days',
        timezone: 'UTC',
      },
    ];

    const chartWidget = {
      ...widgetFixture,
      data: {
        query: {
          analysis_type: 'funnel',
          steps,
        },
      },
      widget: {
        ...widgetFixture.widget,
        datePickerId: '@date-picker/01',
        query,
      },
    };

    const test = sagaHelper(wrapper(chartWidget));

    test('get date picker widget settings', (result) => {
      expect(result).toEqual(select(getWidget, '@date-picker/01'));

      return {
        isActive: true,
        data: { timeframe: 'this_30_days', timezone: 'US/Central' },
      };
    });

    test('applies modifiers on funnel steps', (result) => {
      expect(result).toEqual({
        hasQueryModifiers: true,
        query: {
          analysis_type: 'funnel',
          steps: [
            {
              event_collection: 'logins',
              timeframe: 'this_30_days',
              timezone: 'US/Central',
            },
          ],
        },
      });
    });
  });
});

describe('initializeChartWidget()', () => {
  const widgetId = '@widget/01';

  describe('Scenario 1: Query is detached from visualization', () => {
    const action = initializeChartWidgetAction(widgetId);
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
        query: query,
        datePickerId: null,
        settings: {
          visualizationType: 'line',
        },
      },
    };

    const analysisResult = {
      result: 10,
      query,
    };

    test('gets widget settings', (result) => {
      expect(result).toEqual(select(getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query, hasQueryModifiers: false };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, true)));
    });

    test('gets Keen API client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith(query);

      return analysisResult;
    });

    test('performs detached query flow', (result) => {
      expect(result).toEqual(call(handleDetachedQuery, widgetId, 'line'));
    });
  });

  describe('Scenario 2: Initializes chart widget with saved query', () => {
    const action = initializeChartWidgetAction(widgetId);
    const test = sagaHelper(initializeChartWidget(action));

    const keenAnalysis = {
      query: jest.fn(),
    };

    const chartWidget: any = {
      widget: {
        query: 'logins',
        datePickerId: null,
        settings: {
          visualizationType: 'metric',
        },
      },
    };

    const analysisResult = {
      result: 10,
      query: {
        analysis_type: 'count',
      },
    };

    test('gets widget settings', (result) => {
      expect(result).toEqual(select(getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query: 'logins', hasQueryModifiers: false };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, true)));
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
      expect(result).toEqual(select(getInterimQuery, widgetId));

      return undefined;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: true,
            data: analysisResult,
          })
        )
      );
    });
  });

  describe('Scenario 3: Initializes chart widget with saved query and active date picker', () => {
    const action = initializeChartWidgetAction(widgetId);
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
        datePickerId: null,
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
      expect(result).toEqual(select(getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query, hasQueryModifiers: true };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, true)));
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
      expect(result).toEqual(put(addInterimQuery(widgetId, analysisResult)));
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: true,
          })
        )
      );
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, false)));
    });
  });

  describe('Scenario 4: Failed to initialize chart widget', () => {
    const action = initializeChartWidgetAction(widgetId);
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
      expect(result).toEqual(select(getWidget, widgetId));

      return chartWidget;
    });

    test('prepares widget query', (result) => {
      expect(result).toEqual(call(prepareChartWidgetQuery, chartWidget));

      return { query: 'purchases', hasQueryModifiers: false };
    });

    test('set widgets loading state', (result) => {
      expect(result).toEqual(put(setWidgetLoading(widgetId, true)));
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
          setWidgetState(widgetId, {
            isInitialized: true,
            error: {
              message: errorBody,
            },
          })
        )
      );
    });
  });
});
