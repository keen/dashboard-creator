import sagaHelper from 'redux-saga-testing';
import { put, take, getContext } from 'redux-saga/effects';

import {
  deleteDashboard as deleteDashboardAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
  deleteDashboardSuccess,
  registerDashboard,
  setDashboardList,
  updateDashboard,
  setDashboardError,
  initializeDashboardWidgets,
  viewPublicDashboard as viewPublicDashboardAction,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
} from './actions';
import { removeDashboardTheme } from '../theme/actions';
import {
  deleteDashboard,
  removeWidgetFromDashboard,
  viewPublicDashboard,
} from './saga';

import { removeWidget, registerWidgets } from '../widgets';
import { setDashboardTheme } from '../theme';
import { setActiveDashboard } from '../app';

import { serializeDashboard } from './serializers';

import { DashboardModel, DashboardMetaData, DashboardError } from './types';

import {
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from './constants';

import { NOTIFICATION_MANAGER, BLOB_API } from '../../constants';

describe('viewPublicDashboard()', () => {
  const dashboardId = '@dashboard/01';
  const action = viewPublicDashboardAction(dashboardId);

  const dashboardMetadata: DashboardMetaData = {
    id: dashboardId,
    widgets: 0,
    queries: 2,
    title: 'Dashboard',
    tags: [],
    lastModificationDate: 1606895352390,
    isPublic: true,
  };

  const dashboard: DashboardModel = {
    version: '0.0.1',
    widgets: [],
  };

  describe('Scenario 1: User access public dashboard', () => {
    const test = sagaHelper(viewPublicDashboard(action));
    const blobApiMock = {
      getDashboardMetaById: jest.fn(),
      getDashboardById: jest.fn(),
    };

    test('accessed dashboard is registered', (result) => {
      expect(result).toEqual(put(registerDashboard(dashboardId)));
    });

    test('set active dashboard', (result) => {
      expect(result).toEqual(put(setActiveDashboard(dashboardId)));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('fetch dashboard metadata', () => {
      expect(blobApiMock.getDashboardMetaById).toHaveBeenCalledWith(
        dashboardId
      );

      return dashboardMetadata;
    });

    test('set dashboards list', (result) => {
      expect(result).toEqual(put(setDashboardList([dashboardMetadata])));
    });

    test('fetch dashboard', () => {
      expect(blobApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

      return dashboard;
    });

    test('register dashboard widgets', (result) => {
      expect(result).toEqual(put(registerWidgets([])));
    });

    test('updates dashboard', (result) => {
      const serializedDashboard = serializeDashboard(dashboard);

      expect(result).toEqual(
        put(updateDashboard(dashboardId, serializedDashboard))
      );
    });

    test('set dashboard theme', (result) => {
      expect(result).toEqual(put(setDashboardTheme(dashboardId, undefined)));
    });

    test('initializes dashboard widgets', (result) => {
      expect(result).toEqual(put(initializeDashboardWidgets(dashboardId, [])));
    });
  });

  describe('Scenario 2: User access not public dashboard', () => {
    const test = sagaHelper(viewPublicDashboard(action));
    const blobApiMock = {
      getDashboardMetaById: jest.fn(),
    };

    test('accessed dashboard is registered', (result) => {
      expect(result).toEqual(put(registerDashboard(dashboardId)));
    });

    test('set active dashboard', (result) => {
      expect(result).toEqual(put(setActiveDashboard(dashboardId)));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('fetch dashboard metadata', () => {
      expect(blobApiMock.getDashboardMetaById).toHaveBeenCalledWith(
        dashboardId
      );

      return {
        ...dashboardMetadata,
        isPublic: false,
      };
    });

    test('set dashboards list', (result) => {
      expect(result).toEqual(
        put(setDashboardList([{ ...dashboardMetadata, isPublic: false }]))
      );
    });

    test('set dashboard error', (result) => {
      expect(result).toEqual(
        put(setDashboardError(dashboardId, DashboardError.ACCESS_NOT_PUBLIC))
      );
    });
  });
});

describe('removeWidgetFromDashboard()', () => {
  const action = removeWidgetFromDashboardAction('@dashboard/01', '@widget/01');
  const test = sagaHelper(removeWidgetFromDashboard(action));

  test('triggers remove widget', (result) => {
    expect(result).toEqual(put(removeWidget('@widget/01')));
  });
});

describe('deleteDashboard()', () => {
  const dashboardId = '@dashboard/01';
  const action = deleteDashboardAction('@dashboard/01');

  const blobApiMock = {
    deleteDashboard: jest.fn(),
  };

  const notificationManagerMock = {
    showNotification: jest.fn(),
  };

  describe('Scenario 1: User cancel dashboard delete', () => {
    const test = sagaHelper(deleteDashboard(action));

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

  describe('Scenario 2: User succesfully delete dashboard', () => {
    const test = sagaHelper(deleteDashboard(action));

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

  describe('Scenario 3: User failed to delete dashboard', () => {
    const test = sagaHelper(deleteDashboard(action));

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
  });
});
