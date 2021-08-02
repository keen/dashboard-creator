/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { put, select, take, getContext, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { deleteAccessKey } from './deleteAccessKey';

import {
  deleteDashboardSuccess,
  deleteDashboard as deleteDashboardAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
} from '../actions';

import { getDashboardMeta } from '../selectors';

import { themeActions } from '../../theme';

import {
  DASHBOARD_API,
  NOTIFICATION_MANAGER,
  ROUTES,
} from '../../../constants';
import {
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from '../constants';

import { appActions, appSelectors } from '../../app';

/**
 * Flow responsible for removing dashboard
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* deleteDashboard({
  payload,
}: ReturnType<typeof deleteDashboardAction>) {
  const { dashboardId } = payload;
  const { publicAccessKey } = yield select(getDashboardMeta, dashboardId);
  yield put(showDeleteConfirmation(dashboardId));
  const notificationManager = yield getContext(NOTIFICATION_MANAGER);

  const action = yield take([
    CONFIRM_DASHBOARD_DELETE,
    HIDE_DELETE_CONFIRMATION,
  ]);

  if (action.type === CONFIRM_DASHBOARD_DELETE) {
    yield put(hideDeleteConfirmation());
    try {
      const dashboardApi = yield getContext(DASHBOARD_API);
      yield dashboardApi.deleteDashboard(dashboardId);

      const activeDashboardId = yield select(appSelectors.getActiveDashboard);
      if (activeDashboardId) {
        yield put(appActions.setActiveDashboard(null));
        yield put(push(ROUTES.MANAGEMENT));
      }

      yield put(deleteDashboardSuccess(dashboardId));
      yield put(themeActions.removeDashboardTheme({ dashboardId }));

      yield notificationManager.showNotification({
        type: 'info',
        message: 'notifications.dashboard_delete_success',
        autoDismiss: true,
      });
    } catch (err) {
      yield notificationManager.showNotification({
        type: 'error',
        message: 'notifications.dashboard_delete_error',
        showDismissButton: true,
        autoDismiss: false,
      });
    }

    try {
      if (publicAccessKey) {
        yield call(deleteAccessKey, publicAccessKey);
      }
    } catch (err) {
      yield notificationManager.showNotification({
        type: 'error',
        message: 'dashboard_share.access_key_api_error',
        showDismissButton: true,
        autoDismiss: false,
      });
    }
  }
}
