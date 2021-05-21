import { takeLatest } from 'redux-saga/effects';

import { editDashboardTheme, previewDashboardTheme } from './saga';
import { themeSagaActions } from './actions';

export function* themeSaga() {
  yield takeLatest(
    themeSagaActions.editDashboardTheme.type,
    editDashboardTheme
  );
  yield takeLatest(themeSagaActions.previewTheme.type, previewDashboardTheme);
}
