/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
import sagaHelper from 'redux-saga-testing';
import { put, take, select, getContext, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

import { deleteDashboard } from './deleteDashboard';
import { deleteAccessKey } from './deleteAccessKey';

import {
  deleteDashboard as deleteDashboardAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
  deleteDashboardSuccess,
} from '../actions';
import { themeActions } from '../../theme';

import {
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from '../constants';

import {
  NOTIFICATION_MANAGER,
  DASHBOARD_API,
  ROUTES,
} from '../../../constants';
import { getDashboardMeta } from '../selectors';

import { appActions, appSelectors } from '../../app';

const dashboardId = '@dashboard/01';

describe('deleteDashboard()', () => {
  const action = deleteDashboardAction(dashboardId);

  const dashboardApiMock = {
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

    test('gets DashboardAPI instance from context', (result) => {
      expect(result).toEqual(getContext(DASHBOARD_API));

      return dashboardApiMock;
    });

    test('calls dashboard delete method with dashboard identifer', () => {
      expect(dashboardApiMock.deleteDashboard).toHaveBeenCalledWith(
        dashboardId
      );
    });

    test('get active dashboard identifer', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return null;
    });

    test('triggers dashboard delete success action with dashboard identifer', (result) => {
      expect(result).toEqual(put(deleteDashboardSuccess(dashboardId)));
    });

    test('triggers dashboard theme removal action with dashboard identifer', (result) => {
      expect(result).toEqual(
        put(themeActions.removeDashboardTheme({ dashboardId }))
      );
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

    test('gets DashboardAPI instance from context', (result) => {
      expect(result).toEqual(getContext(DASHBOARD_API));

      return dashboardApiMock;
    });

    test('calls dashboard delete method with dashboard identifer', () => {
      expect(dashboardApiMock.deleteDashboard).toHaveBeenCalledWith(
        dashboardId
      );
    });

    test('get active dashboard identifer', (result) => {
      expect(result).toEqual(select(appSelectors.getActiveDashboard));

      return dashboardId;
    });

    test('set active dashboard identifer', (result) => {
      expect(result).toEqual(put(appActions.setActiveDashboard(null)));
    });

    test('changes application view to management', (result) => {
      expect(result).toEqual(put(push(ROUTES.MANAGEMENT)));
    });

    test('triggers dashboard delete success action with dashboard identifer', (result) => {
      expect(result).toEqual(put(deleteDashboardSuccess(dashboardId)));
    });

    test('triggers dashboard theme removal action with dashboard identifer', (result) => {
      expect(result).toEqual(
        put(themeActions.removeDashboardTheme({ dashboardId }))
      );
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

    test('gets DashboardAPI instance from context', (result) => {
      expect(result).toEqual(getContext(DASHBOARD_API));

      return dashboardApiMock;
    });

    test('calls dashboard delete method with dashboard identifer', () => {
      expect(dashboardApiMock.deleteDashboard).toHaveBeenCalledWith(
        dashboardId
      );

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
