import sagaHelper from 'redux-saga-testing';
import { put, take } from 'redux-saga/effects';
import { chartEditorActions } from '../../chartEditor';
import { removeWidgetFromDashboard } from '../../dashboards';
import { initializeChartWidget as initializeChartWidgetAction } from '../actions';
import { Query } from '@keen.io/query';
import { createQueryForWidget } from './createQueryForWidget';
import { widgetsActions } from '../index';

const widgetId = '@widget/01';
const dashboardId = '@dashboard/01';
const chartEditor = {
  querySettings: {
    analysis_type: 'percentile',
    event_collection: 'logins',
    order_by: null,
  } as Query,
  visualization: {
    type: 'area',
    chartSettings: {
      groupMode: 'stacked',
    },
    widgetSettings: {},
  },
};

describe('createQueryForWidget()', () => {
  describe('Scenario 1: User close chart widget editor', () => {
    const test = sagaHelper(createQueryForWidget(widgetId));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.closeEditor();
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('removes widget from dashboard', (result) => {
      expect(result).toEqual(
        put(removeWidgetFromDashboard(dashboardId, widgetId))
      );
    });
  });

  describe('Scenario 2: User close chart widget editor for existing widget', () => {
    const test = sagaHelper(createQueryForWidget(widgetId, true));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
      expect(result).toEqual(
        take([
          chartEditorActions.closeEditor.type,
          chartEditorActions.applyConfiguration.type,
        ])
      );

      return chartEditorActions.closeEditor();
    });

    test('closes chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });
  });

  describe('Scenario 3: User applies chart widget configuration', () => {
    const test = sagaHelper(createQueryForWidget(widgetId));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
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

    test('closes chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });

  describe('Scenario 4: User applies chart widget configuration for existing widget', () => {
    const test = sagaHelper(createQueryForWidget(widgetId, true));

    test('opens chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.openEditor()));
    });

    test('waits until user close chart editor', (result) => {
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

    test('closes chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.closeEditor()));
    });

    test('waits until editor is closed', (result) => {
      expect(result).toEqual(take(chartEditorActions.editorUnmounted.type));
    });

    test('reset chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.resetEditor()));
    });

    test('sets widget state', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.setWidgetState({
            id: widgetId,
            widgetState: { isInitialized: false, error: null },
          })
        )
      );
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });
  });
});
