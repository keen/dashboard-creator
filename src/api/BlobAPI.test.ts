import { FetchMock } from 'jest-fetch-mock';

import BlobAPI from './BlobAPI';

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

test('calls API to get blob objects metadata', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({}));
  blobAPI.getDashboards();

  expect(fetch).toHaveBeenCalledWith(`${baseUrl}/metadata/dashboard`, {
    headers: { Authorization: accessKey },
  });
});
