import { put, getContext } from 'redux-saga/effects';

import {
  updateDashboardMeta,
  saveDashboardMeta as saveDashboardMetaAction,
  saveDashboardMetaSuccess,
  saveDashboardMetaError,
} from '../actions';

import { computeDashboardMetadata } from '../utils';

import { DASHBOARD_API, NOTIFICATION_MANAGER } from '../../../constants';

import { DashboardModel } from '../types';

/**
 * Flow responsible for saving dashboard metadata
 * @param dashboardId - dashboard identifer
 * @param metadata - dashboard metadata
 *
 * @return void
 *
 */
export function* saveDashboardMetadata({
  payload,
}: ReturnType<typeof saveDashboardMetaAction>) {
  const { dashboardId, metadata } = payload;
  const notificationManager = yield getContext(NOTIFICATION_MANAGER);

  try {
    const dashboardApi = yield getContext(DASHBOARD_API);
    const responseBody: DashboardModel = yield dashboardApi.getDashboardById(
      dashboardId
    );

    const updatedMetadata = {
      ...metadata,
      ...computeDashboardMetadata(responseBody),
    };

    yield dashboardApi.saveDashboard(
      dashboardId,
      responseBody,
      updatedMetadata
    );

    yield put(updateDashboardMeta(dashboardId, metadata));
    yield put(saveDashboardMetaSuccess());

    yield notificationManager.showNotification({
      type: 'info',
      message: 'notifications.dashboard_meta_success',
      autoDismiss: true,
    });
  } catch (err) {
    yield put(saveDashboardMetaError());
    yield notificationManager.showNotification({
      type: 'error',
      message: 'notifications.dashboard_meta_error',
      showDismissButton: true,
      autoDismiss: false,
    });
  }
}
