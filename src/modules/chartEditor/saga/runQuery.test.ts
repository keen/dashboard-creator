import sagaHelper from 'redux-saga-testing';
import { runQuery } from './runQuery';
import { put, select } from 'redux-saga/effects';
import { chartEditorSelectors } from '../selectors';
import { chartEditorActions } from '../index';

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
