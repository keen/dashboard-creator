import { createNewChart as createNewChartAction } from '../../actions';
import sagaHelper from 'redux-saga-testing';
import { call, put, take } from 'redux-saga/effects';
import { appActions } from '../../../app';
import { queriesActions, SavedQuery } from '../../../queries';
import { createNewChart } from './createNewChart';
import { createQueryForWidget } from '../createQueryForWidget';
import { selectSavedQueryForWidget } from '../selectSavedQueryForWidget';

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

describe('createNewChart()', () => {
  const action = createNewChartAction(widgetId);

  describe('Scenario 1: User creates new chart and close the modal', () => {
    const test = sagaHelper(createNewChart(action));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('user closes modal', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return appActions.hideQueryPicker();
    });

    test('trigger query picker close', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });
  });

  describe('Scenario 2: User creates new query and chooses ad-hoc query', () => {
    const test = sagaHelper(createNewChart(action));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('user selects new query', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.createQuery();
    });

    test('triggers query picker hide', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('calls createQueryForWidget', (result) => {
      expect(result).toEqual(call(createQueryForWidget, widgetId, true));
    });
  });

  describe('Scenario 3: User creates new query and selects saved query', () => {
    const test = sagaHelper(createNewChart(action));

    test('shows query picker', (result) => {
      expect(result).toEqual(put(appActions.showQueryPicker()));
    });

    test('user selects new query', (result) => {
      expect(result).toEqual(
        take([
          queriesActions.selectSavedQuery.type,
          queriesActions.createQuery.type,
          appActions.hideQueryPicker.type,
        ])
      );

      return queriesActions.selectSavedQuery(savedQuery);
    });

    test('triggers query picker hide', (result) => {
      expect(result).toEqual(put(appActions.hideQueryPicker()));
    });

    test('calls selectSavedQueryForWidget', (result) => {
      expect(result).toEqual(
        call(selectSavedQueryForWidget, savedQuery, widgetId, true)
      );
    });
  });
});
