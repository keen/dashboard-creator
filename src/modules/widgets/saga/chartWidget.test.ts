/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, call, take, getContext, select } from 'redux-saga/effects';
import { PickerWidgets, ChartSettings } from '@keen.io/widget-picker';
import { SET_QUERY_EVENT } from '@keen.io/query-creator';
import { Query } from '@keen.io/query';

import {
  initializeChartWidget,
  prepareChartWidgetQuery,
  handleDetachedQuery,
  editChartWidget,
  editChartSavedQuery,
} from './chartWidget';

import {
  openEditor,
  closeEditor,
  resetEditor,
  applyConfiguration,
  setVisualizationSettings,
  setQueryType,
  setQuerySettings,
  setEditMode,
  setQueryResult,
  getChartEditor,
  showQueryUpdateConfirmation,
  EDITOR_MOUNTED,
  EDITOR_UNMOUNTED,
  CLOSE_EDITOR,
  APPLY_CONFIGURATION,
  HIDE_QUERY_UPDATE_CONFIRMATION,
  CONFIRM_SAVE_QUERY_UPDATE,
  USE_QUERY_FOR_WIDGET,
} from '../../../modules/chartEditor';

import { saveDashboard } from '../../../modules/dashboards';

import {
  initializeChartWidget as initializeChartWidgetAction,
  editChartWidget as editChartWidgetAction,
  setWidgetState,
  setWidgetLoading,
  finishChartWidgetConfiguration,
} from '../actions';
import { getWidget, getWidgetSettings } from '../selectors';

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
      expect(result).toEqual(
        call(handleDetachedQuery, widgetId, 'line', analysisResult)
      );
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

describe('editChartSavedQuery()', () => {
  const widgetId = '@widget/01';
  const dashboardId = '@dashboard/01';

  const chartEditor = {
    isSavedQuery: false,
    hasQueryChanged: false,
    visualization: {
      chartSettings: {
        stackMode: 'normal',
      } as ChartSettings,
      type: 'area' as PickerWidgets,
      widgetSettings: {},
    },
    querySettings: {
      analysis_type: 'count',
      event_collection: 'purchases',
      order_by: null,
    } as Query,
  };

  describe('Scenario 1: User edits widget settings without changing query', () => {
    const test = sagaHelper(editChartSavedQuery(widgetId));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));
      return chartEditor;
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: false,
            isConfigured: false,
            error: null,
            data: null,
          })
        )
      );
    });

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query: 'purchases',
      };
    });

    test('finishes chart widget configuration', (result) => {
      const {
        visualization: { type, chartSettings, widgetSettings },
      } = chartEditor;

      const action = finishChartWidgetConfiguration(
        widgetId,
        'purchases',
        type,
        chartSettings,
        widgetSettings
      );

      expect(result).toEqual(put(action));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User edits query and widget settings ', () => {
    const test = sagaHelper(editChartSavedQuery(widgetId));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));
      return {
        ...chartEditor,
        hasQueryChanged: true,
      };
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('shows query update confirmation', (result) => {
      expect(result).toEqual(put(showQueryUpdateConfirmation()));
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([
          HIDE_QUERY_UPDATE_CONFIRMATION,
          CONFIRM_SAVE_QUERY_UPDATE,
          USE_QUERY_FOR_WIDGET,
        ])
      );
    });
  });
});

describe('editChartWidget()', () => {
  const widgetId = '@widget/01';
  const dashboardId = '@dashboard/01';

  const action = editChartWidgetAction(widgetId);
  const visualizationSettings = {
    chartSettings: {
      stackMode: 'percent',
    } as ChartSettings,
    visualizationType: 'area' as PickerWidgets,
    widgetSettings: {},
  };

  describe('Scenario 1: User edits widget with ad-hoc query', () => {
    const test = sagaHelper(editChartWidget(action));
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const pubsub = {
      publish: jest.fn(),
    };

    const chartEditor = {
      isSavedQuery: false,
      visualization: {
        chartSettings: {
          stackMode: 'percent',
        } as ChartSettings,
        type: 'bar' as PickerWidgets,
        widgetSettings: {},
      },
      querySettings: {
        analysis_type: 'count',
        event_collection: 'purchases',
        order_by: null,
      } as Query,
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetFixture,
              data: { query, result: 10 },
              widget: {
                ...widgetFixture.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(setQueryType(false)));
    });

    test('set visualization settings in chart editor', (result) => {
      const {
        visualizationType,
        chartSettings,
        widgetSettings,
      } = visualizationSettings;

      expect(result).toEqual(
        put(
          setVisualizationSettings(
            visualizationType,
            chartSettings,
            widgetSettings
          )
        )
      );
    });

    test('set edit mode in chart editor', (result) => {
      expect(result).toEqual(put(setEditMode(true)));
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(setQuerySettings(query)));
    });

    test('set query results in chart editor', (result) => {
      expect(result).toEqual(put(setQueryResult({ query, result: 10 })));
    });

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits until chart editor is mounted', (result) => {
      expect(result).toEqual(take(EDITOR_MOUNTED));
    });

    test('get pubsub from context', () => {
      return pubsub;
    });

    test('updates query creator settings', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('waits until user applies chart editor settigs', (result) => {
      expect(result).toEqual(take([CLOSE_EDITOR, APPLY_CONFIGURATION]));

      return applyConfiguration();
    });

    test('gets chart editor settings', () => {
      return chartEditor;
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: false,
            isConfigured: false,
            error: null,
            data: null,
          })
        )
      );
    });

    test('finishes chart widget configuration', (result) => {
      const {
        querySettings,
        visualization: { type, chartSettings, widgetSettings },
      } = chartEditor;

      const action = finishChartWidgetConfiguration(
        widgetId,
        querySettings,
        type,
        chartSettings,
        widgetSettings
      );

      expect(result).toEqual(put(action));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User edits widget with saved query', () => {
    const test = sagaHelper(editChartWidget(action));
    const query = 'financial-report';

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetFixture,
              data: { query, result: 10 },
              widget: {
                ...widgetFixture.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(setQueryType(true)));
    });
  });

  describe('Scenario 3: User cancel chart widget edition', () => {
    const test = sagaHelper(editChartWidget(action));
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const pubsub = {
      publish: jest.fn(),
    };

    test('get widget from state', () => {
      return {
        widgets: {
          items: {
            [widgetId]: {
              ...widgetFixture,
              data: { query, result: 500 },
              widget: {
                ...widgetFixture.widget,
                settings: visualizationSettings,
                query,
              },
            },
          },
        },
      };
    });

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(setQueryType(false)));
    });

    test('set visualization settings in chart editor', (result) => {
      const {
        visualizationType,
        chartSettings,
        widgetSettings,
      } = visualizationSettings;

      expect(result).toEqual(
        put(
          setVisualizationSettings(
            visualizationType,
            chartSettings,
            widgetSettings
          )
        )
      );
    });

    test('set edit mode in chart editor', (result) => {
      expect(result).toEqual(put(setEditMode(true)));
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(setQuerySettings(query)));
    });

    test('set query results in chart editor', (result) => {
      expect(result).toEqual(put(setQueryResult({ query, result: 500 })));
    });

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(openEditor()));
    });

    test('waits until chart editor is mounted', (result) => {
      expect(result).toEqual(take(EDITOR_MOUNTED));
    });

    test('get pubsub from context', () => {
      return pubsub;
    });

    test('updates query creator settings', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('waits until user applies chart editor settigs', (result) => {
      expect(result).toEqual(take([CLOSE_EDITOR, APPLY_CONFIGURATION]));

      return closeEditor();
    });

    test('waits until chart editor is unmounted', (result) => {
      expect(result).toEqual(take(EDITOR_UNMOUNTED));
    });

    test('resets chart editor', (result) => {
      expect(result).toEqual(put(resetEditor()));
    });
  });
});
