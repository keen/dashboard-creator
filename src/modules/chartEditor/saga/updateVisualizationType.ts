import { chartEditorActions } from '../index';
import { getContext } from 'redux-saga/effects';
import { PUBSUB } from '../../../constants';
import { UPDATE_VISUALIZATION_TYPE } from '@keen.io/query-creator/dist';

export function* updateVisualizationType({
  payload,
}: ReturnType<typeof chartEditorActions.setVisualizationSettings>) {
  const { type } = payload;
  const pubsub = yield getContext(PUBSUB);
  yield pubsub.publish(UPDATE_VISUALIZATION_TYPE, { type });
}
