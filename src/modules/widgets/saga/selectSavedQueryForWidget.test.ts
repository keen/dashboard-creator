import sagaHelper from 'redux-saga-testing';
import { put } from 'redux-saga/effects';
import { initializeChartWidget as initializeChartWidgetAction } from '../actions';
import { SavedQuery } from '../../queries';
import { widgetsActions } from '../index';
import { selectSavedQueryForWidget } from './selectSavedQueryForWidget';
import { dashboardsActions } from '../../dashboards';

const savedQuery: SavedQuery = {
  id: '@query/01',
  displayName: 'Query 01',
  visualization: {
    type: 'bar',
    chartSettings: {
      layout: 'vertical',
      barPadding: 0.3,
    },
    widgetSettings: {},
  },
  settings: {
    analysis_type: 'count',
    timeframe: 'this_14_days',
    event_collection: 'purchases',
    order_by: null,
  },
};
const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

describe('selectSavedQueryForWidget()', () => {
  const {
    id: queryId,
    visualization: { type: widgetType, chartSettings, widgetSettings },
  } = savedQuery;

  describe('Scenario 1: User selects saved query for non-existing widget', () => {
    const test = sagaHelper(selectSavedQueryForWidget(savedQuery, widgetId));

    test('finishes widget configuration', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.finishChartWidgetConfiguration({
            id: widgetId,
            query: queryId,
            visualizationType: widgetType,
            chartSettings,
            widgetSettings,
          })
        )
      );
    });

    test('initializes chart widget', (result) => {
      expect(result).toEqual(put(initializeChartWidgetAction(widgetId)));
    });

    test('updates access key options if necessary', (result) => {
      expect(result).toEqual(put(dashboardsActions.updateAccessKeyOptions()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
    });
  });

  describe('Scenario 2: User selects saved query for existing widget', () => {
    const test = sagaHelper(
      selectSavedQueryForWidget(savedQuery, widgetId, true)
    );

    test('finishes widget configuration', (result) => {
      expect(result).toEqual(
        put(
          widgetsActions.finishChartWidgetConfiguration({
            id: widgetId,
            query: queryId,
            visualizationType: widgetType,
            chartSettings,
            widgetSettings,
          })
        )
      );
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

    test('updates access key options if necessary', (result) => {
      expect(result).toEqual(put(dashboardsActions.updateAccessKeyOptions()));
    });

    test('gets active dashboard identifier', () => {
      return dashboardId;
    });

    test('triggers save dashboard action', (result) => {
      expect(result).toEqual(put(dashboardsActions.saveDashboard(dashboardId)));
    });
  });
});
