import sagaHelper from 'redux-saga-testing';
import { showUpdateConfirmation } from './showUpdateConfirmation';
import { take } from 'redux-saga/effects';
import { chartEditorActions } from '../index';

describe('showUpdateConfirmation()', () => {
  const test = sagaHelper(showUpdateConfirmation());

  test('waits until update confirmation is presented on a screen', (result) => {
    expect(result).toEqual(
      take(chartEditorActions.queryUpdateConfirmationMounted.type)
    );
  });
});
