import { put, select, call, getContext } from 'redux-saga/effects';
import { StatusCodes } from 'http-status-codes';
import { push } from 'connected-react-router';

import {
  setDashboardError,
  registerDashboard,
  initializeDashboardWidgets,
  viewDashboard as viewDashboardAction,
} from '../actions';

import { prepareDashboard } from './prepareDashboard';
import { dashboardsSelectors } from '../selectors';

import { appActions } from '../../app';

import { APIError } from '../../../api';

import { DASHBOARD_API, ROUTES } from '../../../constants';

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

    const dashboardApi = yield getContext(DASHBOARD_API);

    try {
      const responseBody: DashboardModel = yield dashboardApi.getDashboardById(
        dashboardId
      );

      const { widgetIds } = yield call(
        prepareDashboard,
        dashboardId,
        responseBody
      );

      yield put(initializeDashboardWidgets(dashboardId, widgetIds));
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
