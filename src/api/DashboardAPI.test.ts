import { FetchMock } from 'jest-fetch-mock';

import DashboardAPI from './DashboardAPI';

import { DashboardAPIHeaders } from './types';

const apiUrl = 'apiUrl';
const projectId = 'projectId';
const accessKey = 'accessKey';
const masterKey = 'masterKey';

let dashboardAPI: DashboardAPI;

beforeEach(() => {
  dashboardAPI = new DashboardAPI({
    accessKey,
    masterKey,
    projectId,
    url: apiUrl,
  });

  (fetch as FetchMock).mockClear();
});

const baseUrl = `${apiUrl}/projects/${projectId}`;

const dashboardId = '@dashboard-id';

const metadata = {
  id: 'id',
  title: 'Dashboard',
  widgets: 0,
  queries: 0,
  tags: [],
  lastModificationDate: 0,
  isPublic: false,
  savedQueries: [],
  publicAccessKey: null,
};

test('calls API to get blob objects metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  dashboardAPI.getDashboards();

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/dashboards/metadata`, {
    headers: { Authorization: accessKey },
  });
});

test('calls API to get dashboard blob object', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  dashboardAPI.getDashboardById(dashboardId);

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/dashboards/${dashboardId}`, {
    headers: { Authorization: accessKey },
  });
});

test('calls API to get dashboard blob object metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  dashboardAPI.getDashboardMetaDataById(dashboardId);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/dashboards/${dashboardId}/metadata`,
    {
      headers: { Authorization: accessKey },
    }
  );
});

test('calls API to save dashboard blob object', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  const body = { widgets: [], version: '0.0.1' };
  dashboardAPI.saveDashboard(dashboardId, body, metadata);

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/dashboards/${dashboardId}`, {
    body: JSON.stringify(body),
    method: 'PUT',
    headers: {
      Authorization: masterKey,
      'Content-Type': 'application/json',
      [DashboardAPIHeaders.MetaData]: JSON.stringify(metadata),
    },
  });
});

test('calls API to save dashboard blob object metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  dashboardAPI.saveDashboardMeta(dashboardId, metadata);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/dashboards/${dashboardId}/metadata`,
    {
      body: JSON.stringify(metadata),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: masterKey,
      },
    }
  );
});

test('calls API to delete dashboard blob object', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  dashboardAPI.deleteDashboard(dashboardId);

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/dashboards/${dashboardId}`, {
    method: 'DELETE',
    headers: {
      Authorization: masterKey,
    },
  });
});
