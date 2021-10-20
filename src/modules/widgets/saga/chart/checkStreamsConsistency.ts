import { Query } from '@keen.io/query';
import { getContext, put } from '@redux-saga/core/effects';

import { chartEditorActions } from '../../../chartEditor';
import { getEventCollections } from '../../utils';
import { KEEN_ANALYSIS } from '../../../../constants';

/**
 * Flow responsible for checking consistency between event streams.
 *
 * @param query - Widget identifer
 * @return Object which contains array of inconsistent events and an indicator
 *
 */

export function* checkStreamsConsistency(query: Query) {
  const isEditable = true;
  let missingCollections = [];

  yield put(chartEditorActions.setLoading(true));

  const collections = getEventCollections(query);
  const client = yield getContext(KEEN_ANALYSIS);

  try {
    const url = client.url(`/3.0/projects/{projectId}/events`, {
      api_key: client.config.masterKey,
      include_schema: false,
    });

    const events = yield fetch(url).then((response) => response.json());
    const fetchedCollections = events.map(({ name }) => name);

    missingCollections = collections.filter(
      (x) => !fetchedCollections.includes(x)
    );

    return {
      isEditable: !!!missingCollections.length,
      missingCollections,
    };
  } catch (err) {
    console.log(err);
    return {
      isEditable,
      missingCollections,
    };
  } finally {
    yield put(chartEditorActions.setLoading(false));
  }
}
