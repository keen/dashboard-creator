import sagaHelper from 'redux-saga-testing';
import { take } from 'redux-saga/effects';
import { chartEditorActions } from '../index';
import { openEditor } from './openEditor';

describe('openEditor', () => {
  const test = sagaHelper(openEditor());

  test('takes editor mounted action', (result) => {
    expect(result).toEqual(take(chartEditorActions.editorMounted.type));
  });
});
