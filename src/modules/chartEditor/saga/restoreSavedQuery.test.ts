import { Query } from '@keen.io/query';
import sagaHelper from 'redux-saga-testing';
import { getContext, put, select } from 'redux-saga/effects';
import { PUBSUB } from '../../../constants';
import { chartEditorSelectors } from '../selectors';
import { chartEditorActions } from '../index';
import {
  SET_CHART_SETTINGS,
  SET_QUERY_EVENT,
} from '@keen.io/query-creator/dist';
import { restoreSavedQuery } from './index';

describe('restoreSavedQuery()', () => {
  describe('Scenario 1: Restores saved query settings', () => {
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const chartEditor = {
      visualization: { chartSettings: { layout: 'vertical' } },
      initialQuerySettings: query,
    };

    const test = sagaHelper(restoreSavedQuery());

    const pubsub = {
      publish: jest.fn(),
    };

    test('get PubSub from context', (result) => {
      expect(result).toEqual(getContext(PUBSUB));

      return pubsub;
    });

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

      return chartEditor;
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQuerySettings(query)));
    });

    test('publish event to update query creator', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('reset query results in chart editor', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQueryResult(null)));
    });
  });

  describe('Scenario 1: Restores query settings with chart settings', () => {
    const query: Query = {
      analysis_type: 'funnel',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const chartEditor = {
      initialQuerySettings: query,
      visualization: {
        chartSettings: { layout: 'vertical', stepLabels: ['Logins'] },
      },
    };

    const test = sagaHelper(restoreSavedQuery());

    const pubsub = {
      publish: jest.fn(),
    };

    test('get PubSub from context', (result) => {
      expect(result).toEqual(getContext(PUBSUB));

      return pubsub;
    });

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

      return chartEditor;
    });

    test('updates chart settings in query creator', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_CHART_SETTINGS, {
        chartSettings: {
          stepLabels: ['Logins'],
        },
      });
    });
  });
});
