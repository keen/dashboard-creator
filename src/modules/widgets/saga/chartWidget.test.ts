/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { all, put, call, take, getContext, select } from 'redux-saga/effects';
import { PickerWidgets, ChartSettings } from '@keen.io/widget-picker';
import { SET_QUERY_EVENT } from '@keen.io/query-creator';
import { Query } from '@keen.io/query';

import {
  prepareChartWidgetQuery,
  handleInconsistentFilters,
  editChartWidget,
  editChartSavedQuery,
  checkIfChartWidgetHasInconsistentFilters,
} from './chartWidget';

import { updateSaveQuery } from '../../../modules/queries';

import { saveDashboard } from '../../../modules/dashboards';

import {
  initializeChartWidget as initializeChartWidgetAction,
  editChartWidget as editChartWidgetAction,
  setWidgetState,
  finishChartWidgetConfiguration,
} from '../actions';
import { getWidget, getWidgetSettings } from '../selectors';

import { widget as widgetFixture } from '../fixtures';

import { TRANSLATIONS } from '../../../constants';

import { WidgetItem, WidgetErrors } from '../types';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';

describe('handleInconsistentFilters()', () => {
  describe('Scenario 1: Handle filter settings inconsistency', () => {
    const widgetId = '@widget/01';
    const test = sagaHelper(handleInconsistentFilters(widgetId));

    test('gets translations from context', (result) => {
      expect(result).toEqual(getContext(TRANSLATIONS));

      return {
        t: jest.fn().mockImplementation((value) => value),
      };
    });

    test('updates widget state', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(widgetId, {
            isInitialized: true,
            error: {
              title: 'widget_errors.inconsistent_filter_title',
              message: 'widget_errors.inconsistent_filter_message',
              code: WidgetErrors.INCONSISTENT_FILTER,
            },
          })
        )
      );
    });
  });
});

describe('checkIfChartWidgetHasInconsistentFilters()', () => {
  describe('Scenario 1: Widget has filters with different event stream', () => {
    const chartWidget = {
      data: {
        query: {
          event_collection: 'purchases',
        },
      },
      widget: {
        id: '@widget/1',
        filterIds: ['@filter/01', '@filter/02'],
      },
    };

    const test = sagaHelper(
      checkIfChartWidgetHasInconsistentFilters(chartWidget)
    );
    test('get connected filter widgets settings ', (result) => {
      expect(result).toEqual(
        all([select(getWidget, '@filter/01'), select(getWidget, '@filter/02')])
      );
      return [
        {
          isActive: true,
          widget: {
            settings: {
              eventStream: 'logins',
            },
          },
        },
        { isActive: false },
      ];
    });

    test('Calls handle inconsistent filters to set appropriate error', (result) => {
      expect(result).toEqual(
        call(handleInconsistentFilters, chartWidget.widget.id)
      );
    });

    test('Returns true which states that widget has inconsistent filters', (result) => {
      expect(result).toBe(true);
    });
  });

  describe('Scenario 2: Widget has filters with the same event stream', () => {
    const chartWidget = {
      data: {
        query: {
          event_collection: 'logins',
        },
      },
      widget: {
        id: '@widget/1',
        filterIds: ['@filter/01', '@filter/02'],
      },
    };

    const test = sagaHelper(
      checkIfChartWidgetHasInconsistentFilters(chartWidget)
    );

    test('get connected filter widgets settings ', (result) => {
      expect(result).toEqual(
        all([select(getWidget, '@filter/01'), select(getWidget, '@filter/02')])
      );
      return [
        {
          isActive: true,
          widget: {
            settings: {
              eventStream: 'logins',
            },
          },
        },
        { isActive: false },
      ];
    });

    test('Returns false which states that widget doesnt have inconsistent filters', (result) => {
      expect(result).toBe(false);
    });
  });

  describe('Scenario 3: Widget has filters with the same event stream but contains error with INCONSISTENT_FILTER code', () => {
    const chartWidget = {
      error: {
        code: WidgetErrors.INCONSISTENT_FILTER,
      },
      data: {
        query: {
          event_collection: 'logins',
        },
      },
      widget: {
        id: '@widget/1',
        filterIds: ['@filter/01', '@filter/02'],
      },
    };

    const test = sagaHelper(
      checkIfChartWidgetHasInconsistentFilters(chartWidget)
    );

    test('get connected filter widgets settings ', (result) => {
      expect(result).toEqual(
        all([select(getWidget, '@filter/01'), select(getWidget, '@filter/02')])
      );
      return [
        {
          isActive: true,
          widget: {
            settings: {
              eventStream: 'logins',
            },
          },
        },
        { isActive: false },
      ];
    });
    test('Calls set widget state to clear the error', (result) => {
      expect(result).toEqual(
        put(
          setWidgetState(chartWidget.widget.id, {
            isInitialized: true,
            error: null,
          })
        )
      );
    });
    test('Returns false which states that widget doesnt have inconsistent filters error', (result) => {
      expect(result).toBe(false);
    });
  });
});

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
          filters: [],
        },
        hasQueryModifiers: true,
      });
    });
  });

  describe('Scenario 3: Prepares query with date and filter modifiers', () => {
    const query = {
      analysis_type: 'count',
      event_collection: 'logins',
      filters: [
        { propertyName: 'country', operator: 'eq', propertyValue: 'USA' },
      ],
    } as Query;

    const chartWidget = {
      ...widgetFixture,
      data: {
        query,
      },
      widget: {
        ...widgetFixture.widget,
        datePickerId: '@date-picker/01',
        filterIds: ['@filter/01', '@filter/02'],
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

    test('get connected filter widgets settings ', (result) => {
      expect(result).toEqual(
        all([select(getWidget, '@filter/01'), select(getWidget, '@filter/02')])
      );

      return [
        {
          isActive: true,
          data: {
            filter: {
              propertyName: 'id',
              operator: 'eq',
              propertyValue: ['@id/01'],
            },
          },
        },
        { isActive: false },
      ];
    });

    test('returns query with filter modifiers', (result) => {
      expect(result).toEqual({
        query: {
          ...query,
          timeframe: 'this_30_days',
          timezone: 'US/Central',
          filters: [
            ...query.filters,
            { propertyName: 'id', operator: 'eq', propertyValue: ['@id/01'] },
          ],
        },
        hasQueryModifiers: true,
      });
    });
  });

  describe('Scenario 4: Prepares query with filter modifiers', () => {
    const query = {
      analysis_type: 'count',
      event_collection: 'logins',
      filters: [
        { propertyName: 'country', operator: 'eq', propertyValue: 'USA' },
      ],
    } as Query;

    const chartWidget = {
      ...widgetFixture,
      data: {
        query,
      },
      widget: {
        ...widgetFixture.widget,
        datePickerId: null,
        filterIds: ['@filter/01', '@filter/02'],
        query,
      },
    };

    const test = sagaHelper(wrapper(chartWidget));

    test('get connected filter widgets settings ', (result) => {
      expect(result).toEqual(
        all([select(getWidget, '@filter/01'), select(getWidget, '@filter/02')])
      );

      return [
        {
          isActive: true,
          data: {
            filter: {
              propertyName: 'id',
              operator: 'eq',
              propertyValue: ['@id/01'],
            },
          },
        },
        { isActive: false },
      ];
    });

    test('returns query with filter modifiers', (result) => {
      expect(result).toEqual({
        query: {
          ...query,
          filters: [
            ...query.filters,
            { propertyName: 'id', operator: 'eq', propertyValue: ['@id/01'] },
          ],
        },
        hasQueryModifiers: true,
      });
    });
  });

  describe('Scenario 5: Returns initial query for non-active modifiers', () => {
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
      widgetSettings: {
        title: {
          content: '@widget/title',
        },
      },
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
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));
      return chartEditor;
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
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
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));
      return {
        ...chartEditor,
        hasQueryChanged: true,
      };
    });

    test('close chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('shows query update confirmation', (result) => {
      expect(result).toEqual(
        put(chartEditorActions.showQueryUpdateConfirmation())
      );
    });

    test('waits for user action', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.hideQueryUpdateConfirmation.type,
          chartEditorActions.confirmSaveQueryUpdate.type,
          chartEditorActions.useQueryForWidget.type,
        ])
      );

      return chartEditorActions.confirmSaveQueryUpdate();
    });

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query: 'purchases',
      };
    });

    test('updates saved query visualization metadata', (result) => {
      const metadata = {
        visualization: {
          chartSettings: {
            stackMode: 'normal',
          },
          type: 'area',
          widgetSettings: {
            title: {
              content: '@widget/title',
            },
          },
        },
      };

      expect(result).toEqual(
        call(updateSaveQuery, 'purchases', chartEditor.querySettings, metadata)
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
    widgetSettings: {
      title: {
        content: '@widget/title',
      },
    },
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
      expect(result).toEqual(put(chartEditorActions.setQueryType(false)));
    });

    test('set visualization settings in chart editor', (result) => {
      const {
        visualizationType,
        chartSettings,
        widgetSettings,
      } = visualizationSettings;

      expect(result).toEqual(
        put(
          chartEditorActions.setVisualizationSettings({
            type: visualizationType,
            chartSettings,
            widgetSettings,
          })
        )
      );
    });

    test('set edit mode in chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.setEditMode(true)));
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQuerySettings(query)));
    });

    test('set query results in chart editor', (result) => {
      expect(result).toEqual(
        put(chartEditorActions.setQueryResult({ query, result: 10 }))
      );
    });

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until chart editor is mounted', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorMounted.type));
    });

    test('get pubsub from context', () => {
      return pubsub;
    });

    test('updates query creator settings', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('waits until user applies chart editor settigs', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.applyConfiguration();
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
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
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
      expect(result).toEqual(put(chartEditorActions.setQueryType(true)));
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
      expect(result).toEqual(put(chartEditorActions.setQueryType(false)));
    });

    test('set visualization settings in chart editor', (result) => {
      const {
        visualizationType,
        chartSettings,
        widgetSettings,
      } = visualizationSettings;

      expect(result).toEqual(
        put(
          chartEditorActions.setVisualizationSettings({
            type: visualizationType,
            chartSettings,
            widgetSettings,
          })
        )
      );
    });

    test('set edit mode in chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.setEditMode(true)));
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQuerySettings(query)));
    });

    test('set query results in chart editor', (result) => {
      expect(result).toEqual(
        put(chartEditorActions.setQueryResult({ query, result: 500 }))
      );
    });

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until chart editor is mounted', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorMounted.type));
    });

    test('get pubsub from context', () => {
      return pubsub;
    });

    test('updates query creator settings', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('waits until user applies chart editor settigs', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.closeEditor();
    });

    test('waits until chart editor is unmounted', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('resets chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
    });
  });
});
