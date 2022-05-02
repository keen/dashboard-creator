import { put, select } from 'redux-saga/effects';
import { Theme } from '@keen.io/charts';

import { updateDashboard } from '../actions';

import { serializeDashboard } from '../serializers';

import { themeActions, themeSagaActions, themeSelectors } from '../../theme';
import { enhanceDashboard } from '../utils';

import { DashboardModel } from '../types';
import { widgetsActions } from '../../widgets';

/**
 * Prepares dashboard model to be used in application
 * @param dashboardId - dashboard identifer
 * @param dashboard - dashboard model
 *
 * @return void
 *
 */
export function* prepareDashboard(
  dashboardId: string,
  dashboard: DashboardModel
) {
  const baseTheme: Theme = yield select(themeSelectors.getBaseTheme);
  const { theme, settings, ...restProperties } = enhanceDashboard(
    dashboard,
    baseTheme
  );

  const serializedDashboard = serializeDashboard(restProperties);
  const { widgets } = dashboard;

  yield put(widgetsActions.registerWidgets({ widgets }));
  yield put(updateDashboard(dashboardId, serializedDashboard));
  yield put(themeActions.setDashboardTheme({ dashboardId, settings, theme }));

  yield put(themeSagaActions.loadDashboardFonts());

  return {
    widgetIds: serializedDashboard.widgets,
  };
}
