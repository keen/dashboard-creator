import sagaHelper from 'redux-saga-testing';
import { put, take, getContext, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

import {
  deleteDashboard as deleteDashboardAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
  deleteDashboardSuccess,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
  cloneDashboard as cloneDashboardAction,
  addClonedDashboard,
  initializeDashboardWidgets as initializeDashboardWidgetsAction,
  updateDashboard,
} from './actions';
import { removeDashboardTheme } from '../theme/actions';
import {
  deleteDashboard,
  removeWidgetFromDashboard,
  cloneDashboard,
} from './saga';

import { removeWidget, registerWidgets } from '../widgets';

import {
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from './constants';

import { NOTIFICATION_MANAGER, BLOB_API, ROUTES } from '../../constants';

import rootReducer from '../../rootReducer';
import { getActiveDashboard, setActiveDashboard } from '../app';

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

describe('cloneDashboard', () => {
  const mockDate = new Date(1611151694059);
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

  const dashbboardId = '@dashboard/01';
  const action = cloneDashboardAction(dashbboardId);

  const model = {
    version: '1',
    widgets: [],
  };

  const metaData = {
    id: '@dashboard/01',
    title: null,
    widgets: 0,
    queries: 0,
    tags: [],
    lastModificationDate: +new Date(),
    isPublic: false,
  };

  const blobApiMock = {
    getDashboardById: jest.fn(),
    getDashboardMetadataById: jest.fn(),
    saveDashboard: jest.fn(),
  };

  const notificationManagerMock = {
    showNotification: jest.fn(),
  };

  describe('Scenario 1: User clone dashboard from management', () => {
    const state = {
      rootReducer,
      app: {
        activeDashboardId: null,
      },
    };
    const test = sagaHelper(cloneDashboard(action));

    test('gets BlobAPI from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('calls getDashboardById with dashboard identifer', () => {
      expect(blobApiMock.getDashboardById).toHaveBeenCalledWith(dashbboardId);

      return model;
    });

    test('calls getDashboardMetadataById with dashboard identifer', () => {
      expect(blobApiMock.getDashboardMetadataById).toHaveBeenCalledWith(
        dashbboardId
      );

      return metaData;
    });

    test('calls saveDashboard', () => {
      expect(blobApiMock.saveDashboard).toHaveBeenCalled();
    });

    test('triggers addClonedDashboard action', (result) => {
      expect(result).toEqual(
        put(addClonedDashboard({ ...metaData, title: 'Clone' }))
      );
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          message: 'notifications.dashboard_cloned',
          autoDismiss: true,
        })
      );
    });

    test('prepare state to get activeDashboardId and check if it is null', (result) => {
      expect(result).toEqual(select());
      const activeDashboard = getActiveDashboard(state);
      expect(activeDashboard).toBeNull();

      return state;
    });
  });

  describe('Scenario 2: User clone dashboard from dashboard view', () => {
    const state = {
      rootReducer,
      app: {
        activeDashboardId: '@dashboard/01',
      },
    };
    const test = sagaHelper(cloneDashboard(action));

    test('gets BlobAPI from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('calls getDashboardById with dashboard identifer', () => {
      expect(blobApiMock.getDashboardById).toHaveBeenCalledWith(dashbboardId);

      return model;
    });

    test('calls getDashboardMetadataById with dashboard identifer', () => {
      expect(blobApiMock.getDashboardMetadataById).toHaveBeenCalledWith(
        dashbboardId
      );

      return metaData;
    });

    test('calls saveDashboard', () => {
      expect(blobApiMock.saveDashboard).toHaveBeenCalled();
    });

    test('triggers addClonedDashboard action', (result) => {
      expect(result).toEqual(
        put(addClonedDashboard({ ...metaData, title: 'Clone' }))
      );
    });

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          message: 'notifications.dashboard_cloned',
          autoDismiss: true,
        })
      );
    });

    test('prepare state to get activeDashboardId and check if it is not null', (result) => {
      expect(result).toEqual(select());
      const activeDashboard = getActiveDashboard(state);
      expect(activeDashboard).toEqual('@dashboard/01');

      return state;
    });

    test('set proper dashboard as active', (result) => {
      expect(result).toEqual(put(setActiveDashboard(dashbboardId)));
    });

    test('switch route to the cloned dashboard', (result) => {
      expect(result).toEqual(put(push(ROUTES.EDITOR)));
    });

    test('register widgets', (result) => {
      expect(result).toEqual(put(registerWidgets(model.widgets)));
    });

    test('update cloned dashboard', (result) => {
      expect(result).toEqual(put(updateDashboard(dashbboardId, model)));
    });

    test('initialize cloned dashboard widgets', (result) => {
      expect(result).toEqual(
        put(initializeDashboardWidgetsAction(dashbboardId, model.widgets))
      );
    });
  });
});
