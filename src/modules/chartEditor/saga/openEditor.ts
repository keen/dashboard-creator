import { take } from 'redux-saga/effects';
import { chartEditorActions } from '../../chartEditor';

export function* openEditor(): Generator<unknown, void, boolean> {
  yield take(chartEditorActions.editorMounted.type);
}
