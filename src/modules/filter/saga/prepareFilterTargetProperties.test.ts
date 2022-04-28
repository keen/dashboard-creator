import sagaHelper from 'redux-saga-testing';
import fetchMock from 'jest-fetch-mock';
import { getContext, put } from 'redux-saga/effects';
import { KEEN_ANALYSIS } from '../../../constants';
import { prepareFilterTargetProperties } from './prepareFilterTargetProperties';
import { filterActions } from '../index';

describe('prepareFilterTargetProperties()', () => {
  describe('Scenario 1: Creates filter widget connections list', () => {
    const action = filterActions.setEventStream('logins');
    const test = sagaHelper(prepareFilterTargetProperties(action));

    const keenClient = {
      url: jest.fn().mockImplementation(() => '@keen/url'),
      config: {
        masterKey: '@masterKey',
      },
    };

    const schemaProperties = {
      id: 'string',
      'user.gender': 'string',
    };

    const tree = {
      user: { gender: ['user.gender', 'string'] },
      id: ['id', 'string'],
    };

    const schemaList = [
      { path: 'id', type: 'string' },
      { path: 'user.gender', type: 'string' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify({}));

    test('set schema processing indicator', (result) => {
      expect(result).toEqual(put(filterActions.setSchemaProcessing(true)));
    });

    test('gets client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenClient;
    });

    test('performs request to fetch event stream schema', () => {
      return {
        properties: schemaProperties,
      };
    });

    test('creates tree from schema properties', (result) => {
      expect(result).toEqual(tree);

      return tree;
    });

    test('set event stream schema', (result) => {
      expect(result).toEqual(
        put(
          filterActions.setEventStreamSchema({
            schema: schemaProperties,
            schemaTree: tree,
            schemaList,
          })
        )
      );
    });

    test('clears schema processing error', (result) => {
      expect(result).toEqual(
        put(filterActions.setSchemaProcessingError(false))
      );
    });

    test('set schema processing indicator', (result) => {
      expect(result).toEqual(put(filterActions.setSchemaProcessing(false)));
    });
  });

  describe('Scenario 2: Failed to creates schema tree', () => {
    const action = filterActions.setEventStream('logins');
    const test = sagaHelper(prepareFilterTargetProperties(action));

    const keenClient = {
      url: jest.fn().mockImplementation(() => '@keen/url'),
      config: {
        masterKey: '@masterKey',
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify({}));

    test('set schema processing indicator', (result) => {
      expect(result).toEqual(put(filterActions.setSchemaProcessing(true)));
    });

    test('gets client from context', (result) => {
      expect(result).toEqual(getContext(KEEN_ANALYSIS));

      return keenClient;
    });

    test('performs request to fetch event stream schema', () => {
      return new Error();
    });

    test('set schema processing error', (result) => {
      expect(result).toEqual(put(filterActions.setSchemaProcessingError(true)));
    });
  });
});
