import { put, select } from 'redux-saga/effects';

import { themeSelectors } from '../selectors';
import { appSelectors } from '../../app';
import themeSlice from '../reducer';

/**
 * Flow responsible for applying current changes to dashboard
 *
 * @return void
 *
 */
export function* previewDashboardTheme() {
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const { theme, settings } = yield select(themeSelectors.getCurrentEditTheme);

  yield put(
    themeSlice.actions.setDashboardTheme({
      dashboardId,
      settings,
      theme,
    })
  );
}
