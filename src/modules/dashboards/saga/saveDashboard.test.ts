/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-unused-vars */
import sagaHelper from 'redux-saga-testing';
import { put, select, getContext } from 'redux-saga/effects';
import { Query } from '@keen.io/query';

jest.mock('uuid', () => {
  return {
    v4: () => '@dashboard/01',
  };
});

import { saveDashboard } from './saveDashboard';

import {
  saveDashboard as saveDashboardAction,
  updateDashboardMeta,
  saveDashboardSuccess,
  saveDashboardError,
} from '../actions';
import { dashboardsSelectors } from '../selectors';

import { themeSelectors } from '../../theme';
import { serializeWidget, Widget } from '../../widgets';

import { BLOB_API } from '../../../constants';

import { DashboardSettings, DashboardMetaData } from '../types';

const dashboardId = '@dashboard/01';

const savedQueryWidget: Widget = {
  id: '@widget/01',
  position: { x: 0, y: 0, w: 2, h: 3 },
  type: 'visualization',
  query: 'purchases',
  datePickerId: null,
  filterIds: [],
  settings: {
    visualizationType: 'bar',
    chartSettings: {},
    widgetSettings: {},
  },
};

const chartWidget: Widget = {
  id: '@widget/02',
  datePickerId: null,
  filterIds: [],
  position: { x: 0, y: 0, w: 2, h: 3 },
  type: 'visualization',
  query: {
    analysis_type: 'count',
  } as Query,
  settings: {
    visualizationType: 'pie',
    chartSettings: {},
    widgetSettings: {},
  },
};

const dashboard = {
  version: '0.0.1',
  widgets: ['@widget/01', '@widget/02'],
};
const state = {
  widgets: {
    items: {
      '@widget/01': serializeWidget(savedQueryWidget),
      '@widget/02': serializeWidget(chartWidget),
    },
  },
  app: {
    activeDashboardId: dashboardId,
  },
  dashboards: {
    items: {
      [dashboardId]: dashboard,
    },
  },
  theme: {
    dashboards: {
      [dashboardId]: {
        theme: {
          colors: ['navybule'],
        },
        settings: {
          page: {
            gridGap: 40,
          },
        } as DashboardSettings,
      },
    },
  },
};

const blobApiMock = {
  saveDashboard: jest.fn(),
};

const updatedMetadata: DashboardMetaData = {
  id: dashboardId,
  widgets: 0,
  queries: 1,
  title: 'Dashboard',
  tags: [],
  lastModificationDate: 0,
  isPublic: true,
  publicAccessKey: 'public-access-key',
};

beforeAll(() => {
  const mockDate = (new Date(0) as unknown) as string;
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
});

describe('Scenario 1: User succesfully saved dashboard', () => {
  const action = saveDashboardAction(dashboardId);
  const test = sagaHelper(saveDashboard(action));

  test('get state', (result) => {
    expect(result).toEqual(select());

    return state;
  });

  test('get dashboard settings', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboardSettings, dashboardId)
    );

    return dashboard;
  });

  test('get dashboard theme', (result) => {
    expect(result).toEqual(
      select(themeSelectors.getThemeByDashboardId, dashboardId)
    );

    return state.theme.dashboards[dashboardId];
  });

  test('get dashboards meta data', (result) => {
    expect(result).toEqual(select(dashboardsSelectors.getDashboardsMetadata));

    return [updatedMetadata];
  });

  test('gets BlobAPI instance from context', (result) => {
    expect(result).toEqual(getContext(BLOB_API));

    return blobApiMock;
  });

  test('calls saveDashboard', () => {
    const { settings, ...restSavedQueryWidget } = savedQueryWidget;

    expect(blobApiMock.saveDashboard).toHaveBeenCalledWith(
      dashboardId,
      {
        ...dashboard,
        ...state.theme.dashboards[dashboardId],
        widgets: [restSavedQueryWidget, chartWidget],
      },
      updatedMetadata
    );
  });

  test('updates dashboard metadata', (result) => {
    expect(result).toEqual(
      put(updateDashboardMeta(dashboardId, updatedMetadata))
    );
  });

  test('notifies about save success', (result) => {
    expect(result).toEqual(put(saveDashboardSuccess(dashboardId)));
  });
});

describe('Scenario 2: Error occured during dashboard save', () => {
  const action = saveDashboardAction(dashboardId);
  const test = sagaHelper(saveDashboard(action));

  test('get state', (result) => {
    expect(result).toEqual(select());

    return {};
  });

  test('get dashboard settings', (result) => {
    expect(result).toEqual(
      select(dashboardsSelectors.getDashboardSettings, dashboardId)
    );

    return new Error();
  });

  test('notifies about save error', (result) => {
    expect(result).toEqual(put(saveDashboardError(dashboardId)));
  });
});
