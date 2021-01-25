/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, take, select, getContext, call } from 'redux-saga/effects';

import {
  deleteDashboard as deleteDashboardAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
  deleteDashboardSuccess,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
  regenerateAccessKey as regenerateAccessKeyAction,
  saveDashboardMeta as saveDashboardMetaAction,
} from './actions';
import { removeDashboardTheme } from '../theme/actions';
import {
  deleteAccessKey,
  deleteDashboard,
  removeWidgetFromDashboard,
  updateAccessKeyOptions,
  regenerateAccessKey,
  createAccessKey,
} from './saga';

import { removeWidget, getWidgetSettings } from '../widgets';

import {
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from './constants';

import { NOTIFICATION_MANAGER, BLOB_API } from '../../constants';
import { getDashboardMeta } from './selectors';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

describe('removeWidgetFromDashboard()', () => {
  const action = removeWidgetFromDashboardAction(dashboardId, widgetId);

  describe('Scenario 1: User removes visualization widget from dashboard', () => {
    const test = sagaHelper(removeWidgetFromDashboard(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query: 'purchases',
        type: 'visualization',
      };
    });

    test('select state', (result) => {
      expect(result).toEqual(call(updateAccessKeyOptions));
    });

    test('triggers remove widget', (result) => {
      expect(result).toEqual(put(removeWidget(widgetId)));
    });
  });

  describe('Scenario 2: User removes image widget from dashboard', () => {
    const test = sagaHelper(removeWidgetFromDashboard(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        type: 'image',
      };
    });

    test('triggers remove widget', (result) => {
      expect(result).toEqual(put(removeWidget(widgetId)));
    });
  });
});

describe('deleteDashboard()', () => {
  // const dashboardId = '@dashboard/01';
  const action = deleteDashboardAction(dashboardId);

  const blobApiMock = {
    deleteDashboard: jest.fn(),
  };

  const notificationManagerMock = {
    showNotification: jest.fn(),
  };

  describe('Scenario 1: User cancel dashboard delete', () => {
    const test = sagaHelper(deleteDashboard(action));

    test('selects access key for dashboard', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {
        publicAccessKey: null,
      };
    });

    test('triggers show delete confirmation action with dashboard identifer', (result) => {
      expect(result).toEqual(put(showDeleteConfirmation(dashboardId)));
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([CONFIRM_DASHBOARD_DELETE, HIDE_DELETE_CONFIRMATION])
      );

      return { type: HIDE_DELETE_CONFIRMATION };
    });

    test('terminates delete dashboard flow', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario 2: User succesfully delete dashboard that is not public', () => {
    const test = sagaHelper(deleteDashboard(action));

    test('selects access key for dashboard', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {
        publicAccessKey: null,
      };
    });

    test('triggers show delete confirmation action with dashboard identifer', (result) => {
      expect(result).toEqual(put(showDeleteConfirmation(dashboardId)));
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([CONFIRM_DASHBOARD_DELETE, HIDE_DELETE_CONFIRMATION])
      );

      return { type: CONFIRM_DASHBOARD_DELETE };
    });

    test('triggers hides confirmation action', (result) => {
      expect(result).toEqual(put(hideDeleteConfirmation()));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('calls dashboard delete method with dashboard identifer', () => {
      expect(blobApiMock.deleteDashboard).toHaveBeenCalledWith(dashboardId);
    });

    test('triggers dashboard delete success action with dashboard identifer', (result) => {
      expect(result).toEqual(put(deleteDashboardSuccess(dashboardId)));
    });

    test('triggers dashboard theme removal action with dashboard identifer', (result) => {
      expect(result).toEqual(put(removeDashboardTheme(dashboardId)));
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          autoDismiss: true,
        })
      );
    });

    test('terminates delete dashboard flow', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario 3: User succesfully delete dashboard that is public', () => {
    const test = sagaHelper(deleteDashboard(action));
    const publicAccessKey = 'public-key';

    test('selects access key for dashboard', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {
        publicAccessKey,
      };
    });

    test('triggers show delete confirmation action with dashboard identifer', (result) => {
      expect(result).toEqual(put(showDeleteConfirmation(dashboardId)));
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([CONFIRM_DASHBOARD_DELETE, HIDE_DELETE_CONFIRMATION])
      );

      return { type: CONFIRM_DASHBOARD_DELETE };
    });

    test('triggers hides confirmation action', (result) => {
      expect(result).toEqual(put(hideDeleteConfirmation()));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('calls dashboard delete method with dashboard identifer', () => {
      expect(blobApiMock.deleteDashboard).toHaveBeenCalledWith(dashboardId);
    });

    test('triggers dashboard delete success action with dashboard identifer', (result) => {
      expect(result).toEqual(put(deleteDashboardSuccess(dashboardId)));
    });

    test('triggers dashboard theme removal action with dashboard identifer', (result) => {
      expect(result).toEqual(put(removeDashboardTheme(dashboardId)));
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          autoDismiss: true,
        })
      );
    });

    test('deletes access key from api', (result) => {
      expect(result).toEqual(call(deleteAccessKey, publicAccessKey));
    });

    test('terminates delete dashboard flow', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario 4: User failed to delete dashboard', () => {
    const test = sagaHelper(deleteDashboard(action));

    test('selects access key for dashboard', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {
        publicAccessKey: null,
      };
    });

    test('triggers show delete confirmation action with dashboard identifer', (result) => {
      expect(result).toEqual(put(showDeleteConfirmation(dashboardId)));
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

    test('waits for specific user action', (result) => {
      expect(result).toEqual(
        take([CONFIRM_DASHBOARD_DELETE, HIDE_DELETE_CONFIRMATION])
      );

      return { type: CONFIRM_DASHBOARD_DELETE };
    });

    test('triggers hides confirmation action', (result) => {
      expect(result).toEqual(put(hideDeleteConfirmation()));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('calls dashboard delete method with dashboard identifer', () => {
      expect(blobApiMock.deleteDashboard).toHaveBeenCalledWith(dashboardId);

      return new Error();
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          showDismissButton: true,
          autoDismiss: false,
        })
      );
    });

    test('terminates delete dashboard flow', (result) => {
      expect(result).toBeUndefined();
    });
  });
});

describe('regenerateAccessKey()', () => {
  const dashboardId = '@dashboard/01';
  const action = regenerateAccessKeyAction(dashboardId);
  const test = sagaHelper(regenerateAccessKey(action));
  const publicAccessKey = 'public-access-key';
  const newAccessKey = 'new-access-key';

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
        saveDashboardMetaAction(dashboardId, { publicAccessKey: newAccessKey })
      )
    );
  });

  test('terminates regenerate access key flow', (result) => {
    expect(result).toBeUndefined();
  });
});
