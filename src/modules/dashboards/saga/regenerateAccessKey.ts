import { call, getContext, put, select, take } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import { deleteAccessKey } from './deleteAccessKey';
import { DashboardMetaData } from '../types';
import { NOTIFICATION_MANAGER } from '../../../constants';
import { createAccessKey } from './createAccessKey';
import { dashboardsActions } from '../index';

export function* regenerateAccessKey({
  payload,
}: ReturnType<typeof dashboardsActions.regenerateAccessKey>) {
  const { dashboardId } = payload;
  const metadata = yield select(getDashboardMeta, dashboardId);
  const { publicAccessKey } = metadata;
  if (publicAccessKey) {
    try {
      yield call(deleteAccessKey, publicAccessKey);

      const accessKey = yield call(createAccessKey, dashboardId);
      const { key } = accessKey;
      const updatedMetadata: DashboardMetaData = {
        ...metadata,
        publicAccessKey: key,
      };
      yield put(
        dashboardsActions.saveDashboardMetadata({
          dashboardId,
          metadata: updatedMetadata,
        })
      );
      yield take(dashboardsActions.saveDashboardMetadataSuccess.type);
      yield put(dashboardsActions.regenerateAccessKeySuccess());
    } catch (error) {
      yield put(dashboardsActions.regenerateAccessKeyError());
      const notificationManager = yield getContext(NOTIFICATION_MANAGER);
      yield notificationManager.showNotification({
        type: 'error',
        message: 'dashboard_share.access_key_api_error',
        showDismissButton: true,
        autoDismiss: false,
      });
    }
  }
}
