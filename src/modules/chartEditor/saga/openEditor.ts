import { take } from 'redux-saga/effects';
import { chartEditorActions } from '../index';
import { scrollToElement } from './scrollToElement';

export function* openEditor() {
  yield take(chartEditorActions.editorMounted.type);
  const element = document.getElementById('chart-editor');

  if (element) {
    yield scrollToElement(element);
  }
}
