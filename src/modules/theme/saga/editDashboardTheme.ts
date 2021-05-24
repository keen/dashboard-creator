import { put, select, take } from 'redux-saga/effects';

import { themeSagaActions } from '../actions';

import { themeSelectors } from '../selectors';
import themeSlice from '../reducer';
import { extendTheme } from '../utils';

import { saveDashboard } from '../../dashboards';

import { ThemeSettings } from '../types';

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
  const dashboardTheme: ThemeSettings = yield select(
    themeSelectors.getThemeByDashboardId,
    dashboardId
  );

  const { theme, settings } = dashboardTheme;

  yield put(themeSlice.actions.setInitialDashboardTheme(dashboardTheme));

  const baseTheme = yield select(themeSelectors.getBaseTheme);
  const currentThemeInEdit = extendTheme(theme, baseTheme);

  yield put(
    themeSlice.actions.setCurrentEditTheme({
      theme: currentThemeInEdit,
      settings,
    })
  );

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
        settings,
        theme,
      })
    );
  } else {
    const currentTheme: ThemeSettings = yield select(
      themeSelectors.getCurrentEditTheme
    );
    yield put(
      themeSlice.actions.setDashboardTheme({
        dashboardId,
        theme: currentTheme.theme,
        settings: currentTheme.settings,
      })
    );

    yield put(saveDashboard(dashboardId));
  }

  yield put(
    themeSlice.actions.setModalVisibility({
      isOpen: false,
      inPreviewMode: false,
    })
  );

  yield take(themeSagaActions.editorUnmounted.type);
  yield put(themeSlice.actions.resetDashboardEdit());
}
