import { Theme } from '@keen.io/charts';
import { put, select } from 'redux-saga/effects';
import { themeActions, themeSelectors } from '../../theme';
import { Dashboard } from '../types';
import { createDashboardSettings } from '../utils';
import { appActions } from '../../app';
import { push } from 'connected-react-router';
import { ROUTES } from '../../../constants';
import { dashboardsActions } from '../index';

export function* createDashboard({
  payload: dashboardId,
}: ReturnType<typeof dashboardsActions.createDashboard>) {
  const theme: Theme = yield select(themeSelectors.getBaseTheme);
  const serializedDashboard: Dashboard = {
    version: __APP_VERSION__,
    widgets: [],
  };
  yield put(dashboardsActions.registerDashboard(dashboardId));
  yield put(
    dashboardsActions.updateDashboard({
      dashboardId,
      settings: serializedDashboard,
    })
  );

  yield put(
    themeActions.setDashboardTheme({
      dashboardId,
      theme,
      settings: createDashboardSettings(),
    })
  );

  yield put(appActions.setActiveDashboard(dashboardId));
  yield put(push(ROUTES.EDITOR));
}
