import sagaHelper from 'redux-saga-testing';
import { put, getContext } from 'redux-saga/effects';
import { Query } from '@keen.io/query';

import { KEEN_ANALYSIS } from '../../../../constants';

import { chartEditorActions } from '../../../chartEditor';
import { checkStreamsConsistency } from './checkStreamsConsistency';

describe('checkStreamsConsistency()', () => {
  const keenClient = {
    url: jest.fn().mockImplementation(() => '@keen/url'),
    config: {
      masterKey: '@masterKey',
    },
  };

  const query = {
    analysis_type: 'count',
    event_collection: 'eventStream1',
  } as Query;

  describe('Scenario 1: Returns missing event streams from api', () => {
    const test = sagaHelper(checkStreamsConsistency(query));

    fetchMock.mockResponseOnce(JSON.stringify({}));

    test('sets loading state', (result) => {
      expect(result).toEqual(put(chartEditorActions.setLoading(true)));
    });

    test('gets client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenClient;
    });

    test('performs request to fetch event stream schema', () => {
      return [];
    });
  });

  describe('Scenario 2: Returns existing event streams from api', () => {
    const query = {
      analysis_type: 'count',
      event_collection: 'eventStream1',
    } as Query;

    const test = sagaHelper(checkStreamsConsistency(query));

    fetchMock.mockResponseOnce(JSON.stringify({}));

    test('sets loading state', (result) => {
      expect(result).toEqual(put(chartEditorActions.setLoading(true)));
    });

    test('gets client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenClient;
    });

    test('performs request to fetch event stream schema', () => {
      return [query.event_collection];
    });
  });
});
