import sagaHelper from 'redux-saga-testing';
import { take } from 'redux-saga/effects';
import { showUpdateConfirmation } from './showUpdateConfirmation';
import { chartEditorActions } from '../../chartEditor';

describe('showUpdateConfirmation()', () => {
  const test = sagaHelper(showUpdateConfirmation());

  test('waits until update confirmation is presented on a screen', (result) => {
    expect(result).toEqual(
      take(chartEditorActions.queryUpdateConfirmationMounted.type)
    );
  });
});
