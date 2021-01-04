import { getContext } from 'redux-saga/effects';
import { Query } from '@keen.io/query';

import { KEEN_ANALYSIS } from '../../constants';

import { SavedQueryAPIResponse } from './types';

export function* updateSaveQuery(
  queryId: string,
  querySettings: Query,
  updatedMetadata: Record<string, any> = {}
) {
  const client = yield getContext(KEEN_ANALYSIS);

  const savedQueries: SavedQueryAPIResponse[] = yield client
    .get(client.url('queries', 'saved'))
    .auth(client.masterKey())
    .send();

  const query = savedQueries.find(
    ({ query_name: queryName }) => queryName === queryId
  );

  const { refresh_rate: refreshRate, metadata } = query;

  yield client.put({
    url: client.url('queries', 'saved', queryId),
    apiKey: client.config.masterKey,
    params: {
      refreshRate,
      query: querySettings,
      metadata: {
        ...metadata,
        ...updatedMetadata,
      },
    },
  });
}
