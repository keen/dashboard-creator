import { RootState } from '../../../rootReducer';
import { getContext, select } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import { KEEN_ANALYSIS } from '../../../constants';
import { createPublicDashboardKeyName } from '../utils';
import { generateAccessKeyOptions } from './generateAccessKeyOptions';

export function* updateAccessKey(dashboardId: string) {
  const state: RootState = yield select();
  const { publicAccessKey } = yield getDashboardMeta(state, dashboardId);
  const client = yield getContext(KEEN_ANALYSIS);
  const options = yield generateAccessKeyOptions(dashboardId);
  const params = {
    name: createPublicDashboardKeyName(dashboardId),
    isActive: true,
    permitted: ['queries', 'saved_queries', 'cached_queries', 'schema'],
    ...options,
  };

  yield client.post({
    url: client.url('projectId', 'keys', publicAccessKey),
    api_key: client.masterKey(),
    params,
  });
}
