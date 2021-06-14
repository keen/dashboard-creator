/* eslint-disable @typescript-eslint/naming-convention */
import sagaHelper from 'redux-saga-testing';
import { put, getContext, take, select } from 'redux-saga/effects';
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
  showUpdateConfirmation,
} from './saga';

import { PUBSUB } from '../../constants';
import { chartEditorActions, chartEditorSelectors } from './index';

describe('showUpdateConfirmation()', () => {
  const test = sagaHelper(showUpdateConfirmation());

  test('waits until update confirmation is presented on a screen', (result) => {
    expect(result).toEqual(
      take(chartEditorActions.queryUpdateConfirmationMounted.type)
    );
  });
});

describe('updateQuerySettings()', () => {
  describe('Scenario 1: Query settings are equal initial settings', () => {
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const action = chartEditorActions.setQuerySettings(query);
    const test = sagaHelper(updateQuerySettings(action));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

      return {
        initialQuerySettings: query,
      };
    });

    test('set query change state', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQueryChange(false)));
    });
  });

  describe('Scenario 2: Query settings are different than initial settings', () => {
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const action = chartEditorActions.setQuerySettings(query);
    const test = sagaHelper(updateQuerySettings(action));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

      return {
        initialQuerySettings: {
          ...query,
          event_collection: 'purchases',
        },
      };
    });

    test('set query change state', (result) => {
      expect(result).toEqual(put(chartEditorActions.setQueryChange(true)));
    });
  });

  describe('Scenario 3: Initial query settings was not defined', () => {
    const query: Query = {
      analysis_type: 'count',
      timeframe: 'this_14_days',
      event_collection: 'logins',
      order_by: null,
    };

    const action = chartEditorActions.setQuerySettings(query);
    const test = sagaHelper(updateQuerySettings(action));

    test('get chart editor state', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

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

describe('updateVisualizationType()', () => {
  describe('Scenario 1: Query Creator is notified about visualization change', () => {
    const action = chartEditorActions.setVisualizationSettings({
      type: 'bar',
      chartSettings: {},
      widgetSettings: {},
    });
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

    test('get query settings', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

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
      expect(result).toEqual(
        put(chartEditorActions.runQuerySuccess(analysisResult))
      );
    });
  });

  describe('Scenario 2: User failed to run a query', () => {
    const test = sagaHelper(runQuery());
    const keenAnalysis = {
      query: jest.fn(),
    };
    const queryError = 'QUERY_ERROR';

    const notificationManager = {
      showNotification: jest.fn(),
    };

    test('get query settings', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

      return { querySettings };
    });

    test('get keen analysis from context', () => {
      return keenAnalysis;
    });

    test('performs query', () => {
      expect(keenAnalysis.query).toHaveBeenCalledWith(querySettings);
      const error = new Error() as any;
      error.body = queryError;
      return error;
    });

    test('dispatch run query error action', (result) => {
      expect(result).toEqual(put(chartEditorActions.runQueryError(queryError)));
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

  describe('Scenario 3: User successfully runs funnel analysis', () => {
    const test = sagaHelper(runQuery());
    const keenAnalysis = {
      query: jest.fn(),
    };

    const analysisResult = {
      result: [120, 70],
    };

    const querySettings = {
      analysis_type: 'funnel',
      steps: [
        {
          event_collection: 'logins',
        },
        {
          event_collection: 'purchases',
        },
      ],
    };

    test('get query settings', (result) => {
      expect(result).toEqual(select(chartEditorSelectors.getChartEditor));

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
      expect(result).toEqual(
        put(
          chartEditorActions.runQuerySuccess({
            query: querySettings,
            ...analysisResult,
          })
        )
      );
    });
  });
});
