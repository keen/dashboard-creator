import { put, select, take } from 'redux-saga/effects';

import { themeSagaActions } from '../actions';

import { themeSelectors } from '../selectors';
import themeSlice from '../reducer';
import { extendTheme } from '../utils';

import { saveDashboard } from '../../dashboards';

/**
 * Flow responsible for dashboard theme edition
 *
 * @param dashboardId - dashboard identifier
 * @return void
 *
 */
export function* editDashboardTheme({
  payload,
}: ReturnType<typeof themeSagaActions.editDashboardTheme>) {
  const { dashboardId } = payload;
  const dashboardTheme = yield select(
    themeSelectors.getThemeByDashboardId,
    dashboardId
  );

  yield put(themeSlice.actions.setInitialDashboardTheme(dashboardTheme));

  const baseTheme = yield select(themeSelectors.getBaseTheme);
  const currentThemeInEdit = extendTheme(dashboardTheme, baseTheme);

  yield put(themeSlice.actions.setCurrentEditTheme(currentThemeInEdit));

  yield put(
    themeSlice.actions.setModalVisibility({
      isOpen: true,
      inPreviewMode: false,
    })
  );

  const action = yield take([
    themeSagaActions.saveDashboardTheme.type,
    themeSagaActions.cancelEdition.type,
  ]);

  if (action.type === themeSagaActions.cancelEdition.type) {
    yield put(
      themeSlice.actions.setDashboardTheme({
        dashboardId,
        theme: dashboardTheme,
      })
    );
  } else {
    const currentTheme = yield select(themeSelectors.getCurrentEditTheme);
    yield put(
      themeSlice.actions.setDashboardTheme({
        dashboardId,
        theme: currentTheme,
      })
    );

    yield put(saveDashboard(dashboardId));
    yield put(themeSlice.actions.resetDashboardEdit());
  }

  yield put(
    themeSlice.actions.setModalVisibility({
      isOpen: false,
      inPreviewMode: false,
    })
  );
}
