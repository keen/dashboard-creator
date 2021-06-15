import { take } from 'redux-saga/effects';
import { chartEditorActions } from '../../chartEditor';
import { scrollToElement } from './scrollToElement';

export function* showUpdateConfirmation() {
  yield take(chartEditorActions.queryUpdateConfirmationMounted.type);
  const element = document.getElementById('confirm-query-update');
  if (element) {
    yield scrollToElement(element);
  }
}
