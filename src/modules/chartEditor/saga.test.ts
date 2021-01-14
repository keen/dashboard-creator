/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, getContext, select } from 'redux-saga/effects';
import {
  UPDATE_VISUALIZATION_TYPE,
  SET_CHART_SETTINGS,
  SET_QUERY_EVENT,
} from '@keen.io/query-creator';
import { Query } from '@keen.io/query';

import {
  runQuery,
  restoreSavedQuery,
  updateVisualizationType,
  updateQuerySettings,
} from './saga';
import {
  setVisualizationSettings,
  runQuerySuccess,
  runQueryError,
  setQuerySettings,
  setQueryResult,
  setQueryChange,
} from './actions';
import { getChartEditor } from './selectors';

import { PUBSUB } from '../../constants';

describe('updateQuerySettings()', () => {
  describe('Scenario 1: Query settings are equal initial settings', () => {
    const query: Query = {
      analysis_type: 'count',
      event_collection: 'logins',
      order_by: null,
    };

    const action = setQuerySettings(query);
    const test = sagaHelper(updateQuerySettings(action));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));

      return {
        initialQuerySettings: query,
      };
    });

    test('set query change state', (result) => {
      expect(result).toEqual(put(setQueryChange(false)));
    });
  });

  describe('Scenario 2: Query settings are different than initial settings', () => {
    const query: Query = {
      analysis_type: 'count',
      event_collection: 'logins',
      order_by: null,
    };

    const action = setQuerySettings(query);
    const test = sagaHelper(updateQuerySettings(action));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));

      return {
        initialQuerySettings: {
          ...query,
          event_collection: 'purchases',
        },
      };
    });

    test('set query change state', (result) => {
      expect(result).toEqual(put(setQueryChange(true)));
    });
  });

  describe('Scenario 3: Initial query settings was not defined', () => {
    const query: Query = {
      analysis_type: 'count',
      event_collection: 'logins',
      order_by: null,
    };

    const action = setQuerySettings(query);
    const test = sagaHelper(updateQuerySettings(action));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(getChartEditor));

      return {
        initialQuerySettings: null,
      };
    });

    test('terminates flow', (result) => {
      expect(result).toBeUndefined();
    });
  });
});

describe('restoreSavedQuery()', () => {
  describe('Scenario 1: Restores saved query settings', () => {
    const query: Query = {
      analysis_type: 'count',
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
      expect(result).toEqual(select(getChartEditor));

      return chartEditor;
    });

    test('set query settings in chart editor', (result) => {
      expect(result).toEqual(put(setQuerySettings(query)));
    });

    test('publish event to update query creator', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(SET_QUERY_EVENT, { query });
    });

    test('reset query results in chart editor', (result) => {
      expect(result).toEqual(put(setQueryResult(null)));
    });
  });

  describe('Scenario 1: Restores query settings with chart settings', () => {
    const query: Query = {
      analysis_type: 'funnel',
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
      expect(result).toEqual(select(getChartEditor));

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

describe('updateVisualizationType()', () => {
  describe('Scenario 1: Query Creator is notified about visualization change', () => {
    const action = setVisualizationSettings('bar', {}, {});
    const test = sagaHelper(updateVisualizationType(action));

    const pubsub = {
      publish: jest.fn(),
    };

    test('get PubSub from context', (result) => {
      expect(result).toEqual(getContext(PUBSUB));

      return pubsub;
    });

    test('notifies query creator', () => {
      expect(pubsub.publish).toHaveBeenCalledWith(UPDATE_VISUALIZATION_TYPE, {
        type: 'bar',
      });
    });
  });
});

describe('runQuery()', () => {
  const querySettings = {
    analysis_type: 'count',
    event_collection: 'logins',
    order_by: null,
  };

  const analysisResult = {
    result: 10,
  };

  describe('Scenario 1: User successfully runs query', () => {
    const test = sagaHelper(runQuery());
    const keenAnalysis = {
      query: jest.fn(),
    };

    test('get query settings', () => {
      return { querySettings };
    });

    test('get keen analysis from context', () => {
      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith(querySettings);

      return analysisResult;
    });

    test('dispatch run query success action', (result) => {
      expect(result).toEqual(put(runQuerySuccess(analysisResult)));
    });
  });

  describe('Scenario 2: User failed to run a query', () => {
    const test = sagaHelper(runQuery());
    const keenAnalysis = {
      query: jest.fn(),
    };

    const notificationManager = {
      showNotification: jest.fn(),
    };

    test('get query settings', () => {
      return { querySettings };
    });

    test('get keen analysis from context', () => {
      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith(querySettings);

      return new Error();
    });

    test('dispatch run query error action', (result) => {
      expect(result).toEqual(put(runQueryError()));
    });

    test('get notification manager from context', () => {
      return notificationManager;
    });

    test('displays error notification', () => {
      expect(notificationManager.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          translateMessage: false,
        })
      );
    });
  });
});
