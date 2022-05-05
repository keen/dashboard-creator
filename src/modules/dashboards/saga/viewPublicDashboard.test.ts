/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars */
import sagaHelper from 'redux-saga-testing';
import { put, call, getContext } from 'redux-saga/effects';

import { viewPublicDashboard } from './viewPublicDashboard';
import { prepareDashboard } from './prepareDashboard';

import { appActions } from '../../app';

import { createDashboardSettings } from '../utils';

import { DashboardModel, DashboardMetaData, DashboardError } from '../types';

import { DASHBOARD_API } from '../../../constants';
import { dashboardsActions } from '../index';

const dashboardId = '@dashboard/01';
const action = dashboardsActions.viewPublicDashboard(dashboardId);

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
  const dashboardApiMock = {
    getDashboardMetaDataById: jest.fn(),
    getDashboardById: jest.fn(),
  };

  test('accessed dashboard is registered', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.registerDashboard(dashboardId))
    );
  });

  test('set active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('gets DashboardAPI instance from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard metadata', () => {
    expect(dashboardApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
      dashboardId
    );

    return dashboardMetadata;
  });

  test('set dashboards list', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.setDashboardList({ dashboards: [dashboardMetadata] })
      )
    );
  });

  test('fetch dashboard', () => {
    expect(dashboardApiMock.getDashboardById).toHaveBeenCalledWith(dashboardId);

    return dashboard;
  });

  test('prepares dashboard model', (result) => {
    expect(result).toEqual(call(prepareDashboard, dashboardId, dashboard));

    return {
      widgetIds: ['@widget/01', '@widget/02'],
    };
  });

  test('initializes dashboard widgets', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.initializeDashboardWidgets(dashboardId, [
          '@widget/01',
          '@widget/02',
        ])
      )
    );
  });
});

describe('Scenario 2: User access not public dashboard', () => {
  const test = sagaHelper(viewPublicDashboard(action));
  const dashboardApiMock = {
    getDashboardMetaDataById: jest.fn(),
  };

  test('accessed dashboard is registered', (result) => {
    expect(result).toEqual(
      put(dashboardsActions.registerDashboard(dashboardId))
    );
  });

  test('set active dashboard', (result) => {
    expect(result).toEqual(put(appActions.setActiveDashboard(dashboardId)));
  });

  test('gets DashboardAPI instance from context', (result) => {
    expect(result).toEqual(getContext(DASHBOARD_API));

    return dashboardApiMock;
  });

  test('fetch dashboard metadata', () => {
    expect(dashboardApiMock.getDashboardMetaDataById).toHaveBeenCalledWith(
      dashboardId
    );

    return {
      ...dashboardMetadata,
      isPublic: false,
    };
  });

  test('set dashboards list', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.setDashboardList({
          dashboards: [{ ...dashboardMetadata, isPublic: false }],
        })
      )
    );
  });

  test('set dashboard error', (result) => {
    expect(result).toEqual(
      put(
        dashboardsActions.setDashboardError({
          dashboardId,
          error: DashboardError.ACCESS_NOT_PUBLIC,
        })
      )
    );
  });
});
