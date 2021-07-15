import { getContext } from 'redux-saga/effects';

import { KEEN_ANALYSIS } from '../../../constants';

export function* deleteAccessKey(publicAcessKey: string) {
  const client = yield getContext(KEEN_ANALYSIS);
  yield client.del({
    url: client.url('projectId', `keys/${publicAcessKey}`),
    api_key: client.masterKey(),
  });
}
