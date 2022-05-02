import sagaHelper from 'redux-saga-testing';
import { call, put, take } from 'redux-saga/effects';
import { appActions } from '../../app';
import { queriesActions, SavedQuery } from '../../queries';
import { removeWidgetFromDashboard } from '../../dashboards';
import { selectQueryForWidget } from './selectQueryForWidget';
import { selectSavedQueryForWidget } from './selectSavedQueryForWidget';
import { createQueryForWidget } from './createQueryForWidget';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

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

describe('selectQueryForWidget()', () => {
  describe('Scenario 1: User selects existing save query', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('waits until user select saved query', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.selectSavedQuery(savedQuery);
    });

    test('hides query picker', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('calls selectSavedQueryForWidget', (result) => {
      expect(result).toEqual(
        call(selectSavedQueryForWidget, savedQuery, widgetId)
      );
    });
  });

  describe('Scenario 2: User cancel creation of chart widget', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('waits until user close query picker', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return appActions.hideQueryPicker();
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

  describe('Scenario 3: User creates new query for chart widget', () => {
    const test = sagaHelper(selectQueryForWidget(widgetId));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.createQuery();
    });

    test('hides query picker', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('runs create query flow', (result) => {
      expect(result).toEqual(call(createQueryForWidget, widgetId));
    });
  });
});
