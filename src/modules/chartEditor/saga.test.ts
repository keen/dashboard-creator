/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, getContext } from 'redux-saga/effects';
import { UPDATE_VISUALIZATION_TYPE } from '@keen.io/query-creator';

import { runQuery, updateVisualizationType } from './saga';
import {
  setVisualizationSettings,
  runQuerySuccess,
  runQueryError,
} from './actions';

import { PUBSUB } from '../../constants';

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
