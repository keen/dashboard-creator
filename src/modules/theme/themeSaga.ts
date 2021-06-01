import { takeLatest } from 'redux-saga/effects';

import {
  editDashboardTheme,
  previewDashboardTheme,
  loadDashboardFonts,
} from './saga';
import { themeSagaActions } from './actions';

export function* themeSaga() {
  yield takeLatest(
    themeSagaActions.editDashboardTheme.type,
    editDashboardTheme
  );
  yield takeLatest(themeSagaActions.previewTheme.type, previewDashboardTheme);
  yield takeLatest(
    themeSagaActions.loadDashboardFonts.type,
    loadDashboardFonts
  );
}
