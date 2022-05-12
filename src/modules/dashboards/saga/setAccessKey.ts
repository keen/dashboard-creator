import { call, getContext, put, select } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import { DashboardMetaData } from '../types';
import { NOTIFICATION_MANAGER } from '../../../constants';
import { createAccessKey } from './createAccessKey';
import { dashboardsActions } from '../index';

export function* setAccessKey({
  payload,
}: ReturnType<typeof dashboardsActions.setDashboardPublicAccess>) {
  const { dashboardId, isPublic, accessKey } = payload;
  const metadata = yield select(getDashboardMeta, dashboardId);

  if (accessKey) {
    yield put(
      dashboardsActions.saveDashboardMetadata({ dashboardId, metadata })
    );
  } else {
    if (isPublic) {
      try {
        const accessKey = yield call(createAccessKey, dashboardId);
        const { key: publicAccessKey } = accessKey;

        const updatedMetadata: DashboardMetaData = {
          ...metadata,
          isPublic,
          publicAccessKey,
        };

        yield put(
          dashboardsActions.saveDashboardMetadata({
            dashboardId,
            metadata: updatedMetadata,
          })
        );
      } catch (error) {
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
}
