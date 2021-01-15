import { FetchMock } from 'jest-fetch-mock';

import BlobAPI from './BlobAPI';

import { BlobAPIHeaders } from './types';

const apiUrl = 'apiUrl';
const projectId = 'projectId';
const accessKey = 'accessKey';
const masterKey = 'masterKey';

let blobAPI: BlobAPI;

beforeEach(() => {
  blobAPI = new BlobAPI({
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
};

test('calls API to get blob objects metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  blobAPI.getDashboards();

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/metadata/dashboard`, {
    headers: { Authorization: accessKey },
  });
});

test('calls API to get dashboard blob object', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  blobAPI.getDashboardById(dashboardId);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/blobs/dashboard/${dashboardId}`,
    {
      headers: { Authorization: accessKey },
    }
  );
});

test('calls API to get dashboard blob object metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  blobAPI.getDashboardMetaById(dashboardId);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/metadata/dashboard/${dashboardId}`,
    {
      headers: { Authorization: accessKey },
    }
  );
});

test('calls API to save dashboard blob object', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  const body = { widgets: [], version: '0.0.1' };
  blobAPI.saveDashboard(dashboardId, body, metadata);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/blobs/dashboard/${dashboardId}`,
    {
      body: JSON.stringify(body),
      method: 'PUT',
      headers: {
        Authorization: masterKey,
        [BlobAPIHeaders.MetaData]: JSON.stringify(metadata),
      },
    }
  );
});

test('calls API to save dashboard blob object metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  blobAPI.saveDashboardMeta(dashboardId, metadata);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/metadata/dashboard/${dashboardId}`,
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
  blobAPI.deleteDashboard(dashboardId);

  expect(fetch).toHaveBeenCalledWith(
    `${baseUrl}/blobs/dashboard/${dashboardId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: masterKey,
      },
    }
  );
});
