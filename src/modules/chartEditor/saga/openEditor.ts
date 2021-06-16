import { take } from 'redux-saga/effects';
import { scrollToElement } from './scrollToElement';
import { chartEditorActions } from '../../chartEditor';

export function* openEditor() {
  yield take(chartEditorActions.editorMounted.type);
  const element = document.getElementById('chart-editor');

  if (element) {
    yield scrollToElement(element);
  }
}
