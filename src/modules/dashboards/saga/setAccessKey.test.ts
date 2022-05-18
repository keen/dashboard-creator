import sagaHelper from 'redux-saga-testing';
import { setAccessKey } from './setAccessKey';
import { call, getContext, put, select } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import { NOTIFICATION_MANAGER } from '../../../constants';
import { createAccessKey } from './createAccessKey';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

describe('setAccessKey()', () => {
  const publicAccessKey = 'public-access-key';

  describe('Scenario 1: User successfully sets access key for public dashboard', () => {
    const action = dashboardsActions.setDashboardPublicAccess({
      dashboardId,
      isPublic: true,
      accessKey: null,
    });
    const test = sagaHelper(setAccessKey(action));

    test('selects dashboard metadata', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {};
    });

    test('creates new access key in api', (result) => {
      expect(result).toEqual(call(createAccessKey, dashboardId));
      return {
        key: publicAccessKey,
      };
    });

    test('saves new access key in dashboard meta', (result) => {
      expect(result).toEqual(
        put(
          dashboardsActions.saveDashboardMetadata({
            dashboardId,
            metadata: {
              isPublic: true,
              publicAccessKey: publicAccessKey,
            },
          })
        )
      );
    });
  });

  describe('Scenario 2: User fails to set access key for public dashboard', () => {
    const action = dashboardsActions.setDashboardPublicAccess({
      dashboardId,
      isPublic: true,
      accessKey: null,
    });
    const test = sagaHelper(setAccessKey(action));

    const notificationManagerMock = {
      showNotification: jest.fn(),
    };

    test('selects dashboard metadata', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {};
    });

    test('creates new access key', (result) => {
      expect(result).toEqual(call(createAccessKey, dashboardId));
      return new Error();
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));
      return notificationManagerMock;
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          showDismissButton: true,
          autoDismiss: false,
          message: 'dashboard_share.access_key_api_error',
        })
      );
    });
  });

  describe('Scenario 3: User makes dashboard public and access key exists', () => {
    const action = dashboardsActions.setDashboardPublicAccess({
      dashboardId,
      isPublic: true,
      accessKey: publicAccessKey,
    });
    const test = sagaHelper(setAccessKey(action));

    test('selects dashboard metadata', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {};
    });

    test('saves dashboard metadata', (result) => {
      expect(result).toEqual(
        put(
          dashboardsActions.saveDashboardMetadata({ dashboardId, metadata: {} })
        )
      );
    });
  });
});
