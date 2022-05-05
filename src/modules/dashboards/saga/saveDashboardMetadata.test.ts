import sagaHelper from 'redux-saga-testing';
import { put, getContext } from 'redux-saga/effects';

import { saveDashboardMetadata } from './saveDashboardMetadata';
import { createDashboardSettings } from '../utils';

import { DASHBOARD_API, NOTIFICATION_MANAGER } from '../../../constants';

import { DashboardMetaData } from '../types';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';

const metadata: DashboardMetaData = {
  id: dashboardId,
  widgets: 0,
  queries: 0,
  title: 'Dashboard',
  tags: [],
  lastModificationDate: 0,
  isPublic: true,
  publicAccessKey: 'public-access-key',
};

describe('Scenario 1: User succesfully saves dashboard metadata', () => {
  const action = dashboardsActions.saveDashboardMetadata({
    dashboardId,
    metadata,
  });
  const test = sagaHelper(saveDashboardMetadata(action));

  const dashboardModel = {
    version: '@version',
    settings: createDashboardSettings(),
    widgets: [],
  };

  const notificationManager = {
    showNotification: jest.fn(),
  };

  const dashboardApiMock = {
    getDashboardById: jest.fn(),
    saveDashboard: jest.fn(),
  };

  test('get notification manager from context', (result) => {
    expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

    return notificationManager;
  });

  test('get dashboards API from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

    return dashboardModel;
  });

  test('saves dashboard model', () => {
    expect(dashboardApiMock.saveDashboard).toHaveBeenCalledWith(
      dashboardId,
      dashboardModel,
      metadata
    );
  });

  test('updates dashboard metadata', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.updateDashboardMetadata({ dashboardId, metadata }))
    );
  });

  test('calls dashboard save success action', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.saveDashboardMetadataSuccess())
    );
  });

  test('calls notification manager', () => {
    expect(notificationManager.showNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'info',
        autoDismiss: true,
      })
    );
  });
});

describe('Scenario 2: Error occured during saving dashboard metadata', () => {
  const action = dashboardsActions.saveDashboardMetadata({
    dashboardId,
    metadata,
  });
  const test = sagaHelper(saveDashboardMetadata(action));

  const notificationManager = {
    showNotification: jest.fn(),
  };

  const dashboardApiMock = {
    getDashboardById: jest.fn(),
    saveDashboard: jest.fn(),
  };

  test('get notification manager from context', (result) => {
    expect(result).toEqual(getContext(NOTIFICATION_MANAGER));

    return notificationManager;
  });

  test('get dashboards API from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard from API', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

    return new Error();
  });

  test('calls dashboard save error action', (result) => {
    expect(result).toEqual(put(dashboardsActions.saveDashboardMetadataError()));
  });

  test('calls notification manager', () => {
    expect(notificationManager.showNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        showDismissButton: true,
        autoDismiss: false,
      })
    );
  });
});
