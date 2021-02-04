/* eslint-disable @typescript-eslint/camelcase */
import sagaHelper from 'redux-saga-testing';
import { put, take, select, getContext, call } from 'redux-saga/effects';
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
  registerDashboard,
  setDashboardList,
  updateDashboard,
  setDashboardError,
  initializeDashboardWidgets,
  viewPublicDashboard as viewPublicDashboardAction,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
  regenerateAccessKey as regenerateAccessKeyAction,
  saveDashboardMeta as saveDashboardMetaAction,
  cloneDashboard as cloneDashboardAction,
  addClonedDashboard,
  initializeDashboardWidgets as initializeDashboardWidgetsAction,
  exportDashboardToHtml as exportDashboardToHtmlAction,
} from './actions';
import { removeDashboardTheme } from '../theme/actions';
import {
  deleteAccessKey,
  deleteDashboard,
  removeWidgetFromDashboard,
  updateAccessKeyOptions,
  regenerateAccessKey,
  createAccessKey,
  viewPublicDashboard,
  cloneDashboard,
  exportDashboardToHtml,
} from './saga';

import { removeWidget, registerWidgets, getWidgetSettings } from '../widgets';

import { setDashboardTheme } from '../theme';
import { setActiveDashboard, getActiveDashboard } from '../app';

import { serializeDashboard } from './serializers';
import { createCodeSnippet } from './utils';

import { DashboardModel, DashboardMetaData, DashboardError } from './types';

import rootReducer from '../../rootReducer';

import {
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from './constants';

import {
  NOTIFICATION_MANAGER,
  BLOB_API,
  ROUTES,
  KEEN_ANALYSIS,
} from '../../constants';
import { getDashboardMeta } from './selectors';

const dashboardId = '@dashboard/01';
const widgetId = '@widget/01';

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
    publicAccessKey: 'public-access-key',
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

    test('get active dashboard identifer', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

      return null;
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

    test('get active dashboard identifer', (result) => {
      expect(result).toEqual(select(getActiveDashboard));

      return dashboardId;
    });

    test('changes application view to management', (result) => {
      expect(result).toEqual(put(push(ROUTES.MANAGEMENT)));
    });

    test('set active dashboard identifer', (result) => {
      expect(result).toEqual(put(setActiveDashboard(null)));
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

describe('cloneDashboard', () => {
  const mockDate = (new Date(0) as unknown) as string;
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
    lastModificationDate: 0,
    isPublic: false,
    publicAccessKey: null,
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

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

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

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          message: 'notifications.dashboard_cloned',
          autoDismiss: true,
        })
      );
    });

    test('prepare state activeDashboardId', (result) => {
      expect(result).toEqual(select());

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

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

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

    test('calls show notification method', () => {
      expect(notificationManagerMock.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'info',
          message: 'notifications.dashboard_cloned',
          autoDismiss: true,
        })
      );
    });

    test('prepare state activeDashboardId', (result) => {
      expect(result).toEqual(select());

      return state;
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

    test('set proper dashboard as active', (result) => {
      expect(result).toEqual(put(setActiveDashboard(dashbboardId)));
    });

    test('switch route to the cloned dashboard', (result) => {
      expect(result).toEqual(put(push(ROUTES.EDITOR)));
    });
  });

  describe('Scenario 3: User fail to clone dashboard', () => {
    const test = sagaHelper(cloneDashboard(action));

    test('gets NotificationManager from context', (result) => {
      expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

      return notificationManagerMock;
    });

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

describe('exportDashboardToHtml()', () => {
  const action = exportDashboardToHtmlAction(dashboardId);
  const test = sagaHelper(exportDashboardToHtml(action));

  const projectId = 'projectId';
  const userKey = 'userKey';

  const keenAnalysisMock = {
    config: {
      projectId,
      readKey: userKey,
    },
  };

  const snippet = 'snippet';

  test('get Keen client from context', (result) => {
    expect(result).toEqual(getContext(KEEN_ANALYSIS));

    return keenAnalysisMock;
  });

  test('creates code snippet', (result) => {
    expect(result).toEqual(
      createCodeSnippet({ projectId, userKey, dashboardId })
    );
    return snippet;
  });
});
