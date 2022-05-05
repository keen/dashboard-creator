import sagaHelper from 'redux-saga-testing';
import { regenerateAccessKey } from './regenerateAccessKey';
import { call, getContext, put, select, take } from 'redux-saga/effects';
import { getDashboardMeta } from '../selectors';
import { deleteAccessKey } from './deleteAccessKey';
import { NOTIFICATION_MANAGER } from '../../../constants';
import { createAccessKey } from './createAccessKey';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

describe('regenerateAccessKey()', () => {
  const publicAccessKey = 'public-access-key';
  const newAccessKey = 'new-access-key';

  describe('Scenario 1: User regenerates access key', () => {
    const action = dashboardsActions.regenerateAccessKey({ dashboardId });
    const test = sagaHelper(regenerateAccessKey(action));

    test('selects access key for dashboard', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {
        publicAccessKey,
      };
    });

    test('deletes existing access key', (result) => {
      expect(result).toEqual(call(deleteAccessKey, publicAccessKey));
    });

    test('creates new access key', (result) => {
      expect(result).toEqual(call(createAccessKey, dashboardId));
      return {
        key: newAccessKey,
      };
    });

    test('saves new access key in dashboard meta', (result) => {
      expect(result).toEqual(
        put(
          dashboardsActions.saveDashboardMetadata({
            dashboardId,
            metadata: {
              publicAccessKey: newAccessKey,
            },
          })
        )
      );
    });

    test('waits for dashboard metadata save', (result) => {
      expect(result).toEqual(
        take(dashboardsActions.saveDashboardMetadataSuccess.type)
      );
    });

    test('notifies about regenerating key success', (result) => {
      expect(result).toEqual(
        put(dashboardsActions.regenerateAccessKeySuccess())
      );
    });

    test('terminates regenerate access key flow', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario 2: User fails to regenerate access key', () => {
    const action = dashboardsActions.regenerateAccessKey({ dashboardId });
    const test = sagaHelper(regenerateAccessKey(action));

    const notificationManagerMock = {
      showNotification: jest.fn(),
    };

    test('selects access key for dashboard', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {
        publicAccessKey,
      };
    });

    test('deletes existing access key', (result) => {
      expect(result).toEqual(call(deleteAccessKey, publicAccessKey));
    });

    test('creates new access key', (result) => {
      expect(result).toEqual(call(createAccessKey, dashboardId));
      return new Error();
    });

    test('notifies about regenerating key error', (result) => {
      expect(result).toEqual(put(dashboardsActions.regenerateAccessKeyError()));
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
});
