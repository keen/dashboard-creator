import sagaHelper from 'redux-saga-testing';
import { takeLatest } from 'redux-saga/effects';

import { themeSaga } from './themeSaga';

import {
  editDashboardTheme,
  previewDashboardTheme,
  loadDashboardFonts,
} from './saga';
import { themeSagaActions } from './actions';

describe('Scenario 1: Initializes theme module watchers', () => {
  const test = sagaHelper(themeSaga());

  test('creates dashboard theme watcher', (result) => {
    expect(result).toEqual(
      takeLatest(themeSagaActions.editDashboardTheme.type, editDashboardTheme)
    );
  });

  test('creates preview theme watcher', (result) => {
    expect(result).toEqual(
      takeLatest(themeSagaActions.previewTheme.type, previewDashboardTheme)
    );
  });

  test('creates fonts loader watcher', (result) => {
    expect(result).toEqual(
      takeLatest(themeSagaActions.loadDashboardFonts.type, loadDashboardFonts)
    );
  });
});
