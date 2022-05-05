import { getContext } from 'redux-saga/effects';
import { KEEN_ANALYSIS } from '../../../constants';
import { createPublicDashboardKeyName } from '../utils';
import { generateAccessKeyOptions } from './generateAccessKeyOptions';

export function* createAccessKey(dashboardId: string) {
  const client = yield getContext(KEEN_ANALYSIS);
  const options = yield generateAccessKeyOptions(dashboardId);
  const params = {
    name: createPublicDashboardKeyName(dashboardId),
    isActive: true,
    permitted: ['queries', 'saved_queries', 'cached_queries', 'schema'],
    ...options,
  };
  const accessKey = yield client.post({
    url: client.url('projectId', 'keys'),
    api_key: client.masterKey(),
    params,
  });
  return accessKey;
}
