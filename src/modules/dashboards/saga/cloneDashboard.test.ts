import sagaHelper from 'redux-saga-testing';
import { put, select, getContext } from 'redux-saga/effects';
import { push } from 'connected-react-router';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

import { cloneDashboard } from './cloneDashboard';

import {
  updateDashboard,
  initializeDashboardWidgets,
  cloneDashboard as cloneDashboardAction,
  addClonedDashboard,
} from '../actions';

import { appActions, appSelectors } from '../../app';
import { registerWidgets } from '../../widgets';
import { themeActions } from '../../theme';

import {
  DASHBOARD_API,
  NOTIFICATION_MANAGER,
  ROUTES,
} from '../../../constants';
import { DashboardSettings } from '../types';

const dashboardId = '@dashboard/01';
const action = cloneDashboardAction(dashboardId);

const model = {
  version: '1',
  widgets: [],
  settings: {
    colorPalette: 'default',
    page: {
      gridGap: 20,
      background: 'transparent',
      chartTitlesFont: 'Lato',
      visualizationsFont: 'Lato',
    },
    title: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        fontFamily: 'Lato Regular, sans-serif',
        fontColor: 'black',
      },
    },
    subtitle: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        fontFamily: 'Lato Regular, sans-serif',
        fontColor: 'black',
      },
    },
    legend: {
      typography: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 10,
        fontFamily: 'Lato Regular, sans-serif',
        fontColor: '#000000',
      },
    },
    tiles: {
      background: 'white',
      borderColor: 'transparent',
      borderRadius: 0,
      borderWidth: 1,
      padding: 20,
      hasShadow: false,
    },
  },
  theme: {},
};

const metaData = {
  id: '@dashboard/01',
  title: null,
  widgets: 0,
  queries: 0,
  tags: [],
  lastModificationDate: 0,
  isPublic: false,
  publicAccessKey: '@public-access-key',
};

const dashboardApiMock = {
  getDashboardById: jest.fn(),
  getDashboardMetaDataById: jest.fn(),
  saveDashboard: jest.fn(),
};

const notificationManagerMock = {
  showNotification: jest.fn(),
};

beforeAll(() => {
  const mockDate = (new Date(0) as unknown) as string;
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
});

describe('Scenario 1: User clone dashboard from dashboard view', () => {
  const test = sagaHelper(cloneDashboard(action));

  test('gets NotificationManager from context', (result) => {
    expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

    return notificationManagerMock;
  });

  test('gets DashboardAPI from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('calls getDashboardById with dashboard identifer', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

    return model;
  });

  test('calls getDashboardMetaDataById with dashboard identifer', () => {
    expect(dashboardApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
      dashboardId
    );

    return metaData;
  });

  test('calls saveDashboard', () => {
    expect(dashboardApiMock.saveDashboard).toHaveBeenCalled();
  });

  test('triggers addClonedDashboard action', (result) => {
    expect(result).toEqual(
      put(
        addClonedDashboard({
          ...metaData,
          publicAccessKey: null,
          title: 'Clone',
        })
      )
    );
  });

  test('set theme for cloned dashboard', (result) => {
    expect(result).toEqual(
      put(
        themeActions.setDashboardTheme({
          dashboardId,
          theme: model.theme,
          settings: model.settings as DashboardSettings,
        })
      )
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

  test('get active dashboard identifer', (result) => {
    expect(result).toEqual(select(appSelectors.getActiveDashboard));

    return dashboardId;
  });

  test('register widgets', (result) => {
    expect(result).toEqual(put(registerWidgets(model.widgets)));
  });

  test('update cloned dashboard', (result) => {
    expect(result).toEqual(put(updateDashboard(dashboardId, model)));
  });

  test('initialize cloned dashboard widgets', (result) => {
    expect(result).toEqual(
      put(initializeDashboardWidgets(dashboardId, model.widgets))
    );
  });

  test('set proper dashboard as active', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('switch route to the cloned dashboard', (result) => {
    expect(result).toEqual(put(push(ROUTES.EDITOR)));
  });
});

describe('Scenario 2: User clone dashboard from management', () => {
  const test = sagaHelper(cloneDashboard(action));

  test('gets NotificationManager from context', (result) => {
    expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

    return notificationManagerMock;
  });

  test('gets DashboardAPI from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('calls getDashboardById with dashboard identifer', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

    return model;
  });

  test('calls getDashboardMetaDataById with dashboard identifier', () => {
    expect(dashboardApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
      dashboardId
    );

    return metaData;
  });

  test('calls saveDashboard', () => {
    expect(dashboardApiMock.saveDashboard).toHaveBeenCalled();
  });

  test('triggers addClonedDashboard action', (result) => {
    expect(result).toEqual(
      put(
        addClonedDashboard({
          ...metaData,
          publicAccessKey: null,
          title: 'Clone',
        })
      )
    );
  });

  test('set theme for cloned dashboard', (result) => {
    expect(result).toEqual(
      put(
        themeActions.setDashboardTheme({
          dashboardId,
          theme: model.theme,
          settings: model.settings as DashboardSettings,
        })
      )
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

  test('get active dashboard identifer', (result) => {
    expect(result).toEqual(select(appSelectors.getActiveDashboard));

    return dashboardId;
  });
});

describe('Scenario 3: User fails to clone dashboard', () => {
  const test = sagaHelper(cloneDashboard(action));

  test('gets NotificationManager from context', (result) => {
    expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

    return notificationManagerMock;
  });

  test('gets DashboardAPI from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('calls getDashboardById with dashboard identifer', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

    return model;
  });

  test('calls getDashboardMetaDataById with dashboard identifer', () => {
    expect(dashboardApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
      dashboardId
    );

    return metaData;
  });

  test('calls saveDashboard', () => {
    expect(dashboardApiMock.saveDashboard).toHaveBeenCalled();

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
