import sagaHelper from 'redux-saga-testing';
import { put, take } from 'redux-saga/effects';
import { PickerWidgets, ChartSettings } from '@keen.io/widget-picker';
import { SET_QUERY_EVENT } from '@keen.io/query-creator';
import { Query } from '@keen.io/query';

import { editChart } from './editChart';

import { widget as widgetFixture } from '../../fixtures';

import { chartEditorActions } from '../../../chartEditor';
import { widgetsActions } from '../../index';
import { dashboardsActions } from '../../../dashboards';

describe('editChart()', () => {
  const widgetId = '@widget/01';
  const dashboardId = '@dashboard/01';
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
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const widgetItem = {
      ...widgetFixture,
      data: { query, result: 10 },
      widget: {
        ...widgetFixture.widget,
        settings: visualizationSettings,
        query,
      },
    };

    const test = sagaHelper(editChart(widgetId, widgetItem));

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

    test('sets loading state', (result) => {
      expect(result).toEqual(put(chartEditorActions.setLoading(false)));
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
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: {
              isInitialized: false,
              isConfigured: false,
              error: null,
              data: null,
            },
          })
        )
      );
    });

    test('finishes chart widget configuration', (result) => {
      const {
        querySettings,
        visualization: { type, chartSettings, widgetSettings },
      } = chartEditor;

      const action = widgetsActions.finishChartWidgetConfiguration({
        id: widgetId,
        query: querySettings,
        visualizationType: type,
        chartSettings,
        widgetSettings,
      });

      expect(result).toEqual(put(action));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(
        put(widgetsActions.initializeChartWidget(widgetId))
      );
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
      expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User edits widget with saved query', () => {
    const query = 'financial-report';
    const widgetItem = {
      ...widgetFixture,
      data: { query, result: 10 },
      widget: {
        ...widgetFixture.widget,
        settings: visualizationSettings,
        query,
      },
    };

    const test = sagaHelper(editChart(widgetId, widgetItem));

    test('set chart editor query type', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQueryType(true)));
    });
  });

  describe('Scenario 3: User cancel chart widget edition', () => {
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };
    const widgetItem = {
      ...widgetFixture,
      data: { query, result: 500 },
      widget: {
        ...widgetFixture.widget,
        settings: visualizationSettings,
        query,
      },
    };

    const test = sagaHelper(editChart(widgetId, widgetItem));

    const pubsub = {
      publish: jest.fn(),
    };

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

    test('sets loading state', (result) => {
      expect(result).toEqual(put(chartEditorActions.setLoading(false)));
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
