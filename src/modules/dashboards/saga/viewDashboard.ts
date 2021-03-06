import { put, select, getContext } from 'redux-saga/effects';
import { StatusCodes } from 'http-status-codes';
import { push } from 'connected-react-router';

import {
  setDashboardError,
  registerDashboard,
  updateDashboard,
  initializeDashboardWidgets,
  viewDashboard as viewDashboardAction,
} from '../actions';

import { serializeDashboard } from '../serializers';
import { dashboardsSelectors } from '../selectors';

import { registerWidgets } from '../../widgets';
import { appActions } from '../../app';
import { themeActions, themeSagaActions } from '../../theme';
import { enhanceDashboard } from '../utils';

import { APIError } from '../../../api';

import { BLOB_API, ROUTES } from '../../../constants';

import { DashboardModel, DashboardError } from '../types';

/**
 * Flow responsible for rendering dashboard in viewer mode
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* viewDashboard({
  payload,
}: ReturnType<typeof viewDashboardAction>) {
  const { dashboardId } = payload;
  const dashboard = yield select(dashboardsSelectors.getDashboard, dashboardId);

  if (!dashboard) {
    yield put(registerDashboard(dashboardId));
    yield put(appActions.setActiveDashboard(dashboardId));
    yield put(push(ROUTES.VIEWER));

    const blobApi = yield getContext(BLOB_API);

    try {
      const responseBody: DashboardModel = yield blobApi.getDashboardById(
        dashboardId
      );

      const { theme, settings, ...dashboard } = enhanceDashboard(responseBody);
      const serializedDashboard = serializeDashboard(dashboard);
      const { widgets } = responseBody;

      yield put(registerWidgets(widgets));
      yield put(updateDashboard(dashboardId, serializedDashboard));
      yield put(
        themeActions.setDashboardTheme({ dashboardId, settings, theme })
      );

      yield put(themeSagaActions.loadDashboardFonts());

      yield put(
        initializeDashboardWidgets(dashboardId, serializedDashboard.widgets)
      );
    } catch (err) {
      const error: APIError = err;
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        yield put(setDashboardError(dashboardId, DashboardError.NOT_EXIST));
      } else {
        yield put(setDashboardError(dashboardId, DashboardError.SERVER_ERROR));
      }
    }
  } else {
    yield put(appActions.setActiveDashboard(dashboardId));
    yield put(push(ROUTES.VIEWER));
  }
}
