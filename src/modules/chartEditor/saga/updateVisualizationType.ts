import { getContext } from 'redux-saga/effects';
import { UPDATE_VISUALIZATION_TYPE } from '@keen.io/query-creator';
import { chartEditorActions } from '../../chartEditor';
import { PUBSUB } from '../../../constants';

export function* updateVisualizationType({
  payload,
}: ReturnType<typeof chartEditorActions.setVisualizationSettings>) {
  const { type } = payload;
  const pubsub = yield getContext(PUBSUB);
  yield pubsub.publish(UPDATE_VISUALIZATION_TYPE, { type });
}
