/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
import sagaHelper from 'redux-saga-testing';
import { put, take, select, getContext, call, all } from 'redux-saga/effects';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

import {
  registerDashboard,
  setDashboardList,
  updateDashboard,
  setDashboardError,
  initializeDashboardWidgets,
  viewPublicDashboard as viewPublicDashboardAction,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
  regenerateAccessKey as regenerateAccessKeyAction,
  saveDashboardMeta as saveDashboardMetaAction,
  exportDashboardToHtml as exportDashboardToHtmlAction,
  viewDashboard as viewDashboardAction,
  calculateYPositionAndAddWidget as calculateYPositionAndAddWidgetAction,
  updateCachedDashboardIds,
  unregisterDashboard,
  addWidgetToDashboard,
  setDashboardPublicAccess,
  regenerateAccessKeySuccess,
  regenerateAccessKeyError,
} from './actions';
import { themeActions, themeSagaActions } from '../theme';
import { deleteAccessKey } from './saga';
import {
  removeWidgetFromDashboard,
  updateAccessKeyOptions,
  regenerateAccessKey,
  createAccessKey,
  viewPublicDashboard,
  exportDashboardToHtml,
  updateCachedDashboardsList,
  calculateYPositionAndAddWidget,
  setAccessKey,
} from './dashboardsSaga';

import {
  removeWidget,
  registerWidgets,
  getWidgetSettings,
  getWidget,
  createWidget,
} from '../widgets';

import { serializeDashboard } from './serializers';
import { createCodeSnippet, createDashboardSettings } from './utils';

import { DashboardModel, DashboardMetaData, DashboardError } from './types';

import { SAVE_DASHBOARD_METADATA_SUCCESS } from './constants';

import { NOTIFICATION_MANAGER, BLOB_API, KEEN_ANALYSIS } from '../../constants';
import {
  getCachedDashboardIds,
  getDashboard,
  getDashboardMeta,
} from './selectors';
import { removeConnectionFromFilter } from '../widgets/saga/filterWidget';

import { unregisterWidget } from '../widgets/actions';
import { appActions, appSelectors } from '../app';

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
    settings: createDashboardSettings(),
    theme: {
      colors: ['navyblue'],
    },
  };

  describe('Scenario 1: User access public dashboard', () => {
    const test = sagaHelper(viewPublicDashboard(action));
    const blobApiMock = {
      getDashboardMetaDataById: jest.fn(),
      getDashboardById: jest.fn(),
    };

    test('accessed dashboard is registered', (result) => {
      expect(result).toEqual(put(registerDashboard(dashboardId)));
    });

    test('set active dashboard', (result) => {
      expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('fetch dashboard metadata', () => {
      expect(blobApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
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
      const { theme, settings, ...dashboardSettings } =
        serializeDashboard(dashboard);

      expect(result).toEqual(
        put(updateDashboard(dashboardId, dashboardSettings))
      );
    });

    test('set dashboard theme', (result) => {
      expect(result).toEqual(
        put(
          themeActions.setDashboardTheme({
            dashboardId,
            theme: dashboard.theme,
            settings: dashboard.settings,
          })
        )
      );
    });

    test('load dashboard fonts', (result) => {
      expect(result).toEqual(put(themeSagaActions.loadDashboardFonts()));
    });

    test('initializes dashboard widgets', (result) => {
      expect(result).toEqual(put(initializeDashboardWidgets(dashboardId, [])));
    });
  });

  describe('Scenario 2: User access not public dashboard', () => {
    const test = sagaHelper(viewPublicDashboard(action));
    const blobApiMock = {
      getDashboardMetaDataById: jest.fn(),
    };

    test('accessed dashboard is registered', (result) => {
      expect(result).toEqual(put(registerDashboard(dashboardId)));
    });

    test('set active dashboard', (result) => {
      expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
    });

    test('gets BlobAPI instance from context', (result) => {
      expect(result).toEqual(getContext(BLOB_API));

      return blobApiMock;
    });

    test('fetch dashboard metadata', () => {
      expect(blobApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
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
  const filterIds = ['@filter/01', '@filter/02'];

  describe('Scenario 1: User removes visualization widget from dashboard', () => {
    const test = sagaHelper(removeWidgetFromDashboard(action));

    test('get widget settings', (result) => {
      expect(result).toEqual(select(getWidgetSettings, widgetId));

      return {
        query: 'purchases',
        type: 'visualization',
        filterIds,
      };
    });

    test('update access key options', (result) => {
      expect(result).toEqual(call(updateAccessKeyOptions));
    });

    test('removes connections from filter', (result) => {
      expect(result).toEqual(
        all([
          call(removeConnectionFromFilter, '@filter/01', widgetId),
          call(removeConnectionFromFilter, '@filter/02', widgetId),
        ])
      );
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

describe('regenerateAccessKey()', () => {
  const dashboardId = '@dashboard/01';
  const publicAccessKey = 'public-access-key';
  const newAccessKey = 'new-access-key';

  describe('Scenario 1: User regenerates access key', () => {
    const action = regenerateAccessKeyAction(dashboardId);
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
          saveDashboardMetaAction(dashboardId, {
            publicAccessKey: newAccessKey,
          })
        )
      );
    });

    test('waits for dashboard metadata save', (result) => {
      expect(result).toEqual(take(SAVE_DASHBOARD_METADATA_SUCCESS));
    });

    test('notifies about regenerating key success', (result) => {
      expect(result).toEqual(put(regenerateAccessKeySuccess()));
    });

    test('terminates regenerate access key flow', (result) => {
      expect(result).toBeUndefined();
    });
  });

  describe('Scenario 2: User fails to regenerate access key', () => {
    const action = regenerateAccessKeyAction(dashboardId);
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
      expect(result).toEqual(put(regenerateAccessKeyError()));
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

describe('updateCachedDashboardsList()', () => {
  const dashboardId = '@dashboard/01';
  const action = viewDashboardAction(dashboardId);

  describe('Scenario 1: Should add dashboard id to cached dashboards if total cached dashboards number is less than maximal cached dashboards number', () => {
    const test = sagaHelper(updateCachedDashboardsList(action));
    test('should get cached dashboard ids', (result) => {
      expect(result).toEqual(select(getCachedDashboardIds));
      return [];
    });
    test('should get maximal cached dashboards number', (result) => {
      expect(result).toEqual(select(appSelectors.getCachedDashboardsNumber));
      return 3;
    });
    test('should update state with the array containing the id of visited dashboard', (result) => {
      expect(result).toEqual(put(updateCachedDashboardIds([dashboardId])));
    });
  });

  describe('Scenario 2: Should move dashboard id position to the end of cached dashboards array if dashboard id already exists inside it', () => {
    const test = sagaHelper(updateCachedDashboardsList(action));
    const cachedDashboardIds = [
      '@dashboard/01',
      '@dashboard/03',
      '@dashboard/04',
    ];
    test('should get cached dashboard ids', (result) => {
      expect(result).toEqual(select(getCachedDashboardIds));
      return cachedDashboardIds;
    });
    test('should get maximal cached dashboards number', (result) => {
      expect(result).toEqual(select(appSelectors.getCachedDashboardsNumber));
      return 3;
    });
    test('should update state with array containing recent dashboard id at the end', (result) => {
      expect(result).toEqual(
        put(
          updateCachedDashboardIds([
            '@dashboard/03',
            '@dashboard/04',
            '@dashboard/01',
          ])
        )
      );
    });
  });

  describe('Scenario 3: Should remove the oldest dashboard id from cache and its related widgets', () => {
    const test = sagaHelper(updateCachedDashboardsList(action));
    const cachedDashboardIds = [
      '@dashboard/02',
      '@dashboard/03',
      '@dashboard/04',
    ];

    test('should get cached dashboard ids', (result) => {
      expect(result).toEqual(select(getCachedDashboardIds));
      return cachedDashboardIds;
    });
    test('should get maximal cached dashboards number', (result) => {
      expect(result).toEqual(select(appSelectors.getCachedDashboardsNumber));
      return 3;
    });
    test('should get dashboard to remove', (result) => {
      expect(result).toEqual(select(getDashboard, cachedDashboardIds[0]));
      return {
        settings: {
          widgets: ['@widget/01', '@widget/02', '@widget/03'],
        },
      };
    });
    test('should remove dashboard widgets from cache', (result) => {
      expect(result).toEqual(
        all([
          put(unregisterWidget('@widget/01')),
          put(unregisterWidget('@widget/02')),
          put(unregisterWidget('@widget/03')),
        ])
      );
    });
    test('should remove dashboard from cache', (result) => {
      expect(result).toEqual(put(unregisterDashboard(cachedDashboardIds[0])));
    });
    test('should update cached dashboard ids with the array which not contains removed element', (result) => {
      expect(result).toEqual(
        put(
          updateCachedDashboardIds([
            '@dashboard/03',
            '@dashboard/04',
            '@dashboard/01',
          ])
        )
      );
    });
  });
});

describe('setAccessKey()', () => {
  const dashboardId = '@dashboard/01';
  const publicAccessKey = 'public-access-key';

  describe('Scenario 1: User successfully sets access key for public dashboard', () => {
    const action = setDashboardPublicAccess(dashboardId, true, null);
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
          saveDashboardMetaAction(dashboardId, {
            isPublic: true,
            publicAccessKey: publicAccessKey,
          })
        )
      );
    });
  });

  describe('Scenario 2: User fails to set access key for public dashboard', () => {
    const action = setDashboardPublicAccess(dashboardId, true, null);
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
    const action = setDashboardPublicAccess(dashboardId, true, publicAccessKey);
    const test = sagaHelper(setAccessKey(action));

    test('selects dashboard metadata', (result) => {
      expect(result).toEqual(select(getDashboardMeta, dashboardId));
      return {};
    });

    test('saves dashboard metadata', (result) => {
      expect(result).toEqual(put(saveDashboardMetaAction(dashboardId, {})));
    });
  });
});

describe('calculateYPositionAndAddWidget()', () => {
  const dashboardId = '@dashboard/01';
  const widgetType = 'text';
  describe('should add widget at the end of the grid', () => {
    const action = calculateYPositionAndAddWidgetAction(
      dashboardId,
      widgetType
    );
    const test = sagaHelper(calculateYPositionAndAddWidget(action));

    const dashboardData = {
      settings: {
        widgets: ['@widget/01', '@widget/02', '@widget/03'],
      },
    };
    const dashboardWidgets = [
      {
        widget: {
          position: {
            y: 10,
          },
        },
      },
      {
        widget: {
          position: {
            y: 14,
          },
        },
      },
      {
        widget: {
          position: {
            y: 9,
          },
        },
      },
    ];
    const widgetId = 'widget/@dashboard/01';
    test('should get dashboard data', (result) => {
      expect(result).toEqual(select(getDashboard, dashboardId));
      return dashboardData;
    });

    test('should get widgets data', (result) => {
      expect(result).toEqual(
        all([
          select(getWidget, '@widget/01'),
          select(getWidget, '@widget/02'),
          select(getWidget, '@widget/03'),
        ])
      );
      return dashboardWidgets;
    });

    test('should create widget with appropriate parameters', (result) => {
      expect(result).toEqual(
        put(
          createWidget(widgetId, widgetType, {
            x: 0,
            y: 15,
            w: 2,
            h: 2,
            minW: 2,
            minH: 1,
          })
        )
      );
    });

    test('should add widget to the dashboard', (result) => {
      expect(result).toEqual(put(addWidgetToDashboard(dashboardId, widgetId)));
    });
  });
});
