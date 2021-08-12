/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { put, call, getContext } from 'redux-saga/effects';
import { StatusCodes } from 'http-status-codes';

import {
  registerDashboard,
  initializeDashboardWidgets as initializeDashboardWidgetsAction,
  viewPublicDashboard as viewPublicDashboardAction,
  setDashboardList,
  setDashboardError,
} from '../actions';

import { appActions } from '../../app';
import { prepareDashboard } from './prepareDashboard';

import { DASHBOARD_API } from '../../../constants';

import { APIError } from '../../../api';
import { DashboardModel, DashboardMetaData, DashboardError } from '../types';

/**
 * Flow responsible for initializing public dashboard viewer.
 *
 * @param dashboardId - Dashboard identifer
 * @return void
 *
 */
export function* viewPublicDashboard({
  payload,
}: ReturnType<typeof viewPublicDashboardAction>) {
  const { dashboardId } = payload;

  yield put(registerDashboard(dashboardId));
  yield put(appActions.setActiveDashboard(dashboardId));

  try {
    const dashboardApi = yield getContext(DASHBOARD_API);
    const dashboardMeta: DashboardMetaData = yield dashboardApi.getDashboardMetaDataById(
      dashboardId
    );

    yield put(setDashboardList([dashboardMeta]));
    const { isPublic } = dashboardMeta;

    if (isPublic) {
      const responseBody: DashboardModel = yield dashboardApi.getDashboardById(
        dashboardId
      );

      const { widgetIds } = yield call(
        prepareDashboard,
        dashboardId,
        responseBody
      );

      yield put(initializeDashboardWidgetsAction(dashboardId, widgetIds));
    } else {
      yield put(
        setDashboardError(dashboardId, DashboardError.ACCESS_NOT_PUBLIC)
      );
    }
  } catch (err) {
    const error: APIError = err;
    if (error.statusCode === StatusCodes.NOT_FOUND) {
      yield put(setDashboardError(dashboardId, DashboardError.NOT_EXIST));
    } else {
      yield put(
        setDashboardError(dashboardId, DashboardError.VIEW_PUBLIC_DASHBOARD)
      );
    }
  }
}
