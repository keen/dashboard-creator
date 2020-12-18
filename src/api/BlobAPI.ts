import { handleResponse } from './utils';

import { BlobAPIOptions, BlobAPIHeaders } from './types';

import { DashboardModel, DashboardMetaData } from '../modules/dashboards';

class BlobAPI {
  /** Authorization read access key */
  private readonly readKey: string;

  /** Authorization master key */
  private readonly masterKey: string;

  /** API base url */
  private readonly baseUrl: string;

  constructor({ url, accessKey, masterKey, projectId }: BlobAPIOptions) {
    this.masterKey = masterKey;
    this.readKey = accessKey;
    this.baseUrl = `${url}/projects/${projectId}`;
  }

  getDashboardById = (id: string): Promise<DashboardModel> =>
    fetch(`${this.baseUrl}/blobs/dashboard/${id}`, {
      headers: {
        Authorization: this.readKey,
      },
    }).then(handleResponse);

  getDashboards = (): Promise<DashboardMetaData[]> =>
    fetch(`${this.baseUrl}/metadata/dashboard`, {
      headers: {
        Authorization: this.readKey,
      },
    }).then(handleResponse);

  saveDashboard = (
    id: string,
    body: DashboardModel,
    metadata: DashboardMetaData
  ) =>
    fetch(`${this.baseUrl}/blobs/dashboard/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: this.masterKey,
        [BlobAPIHeaders.MetaData]: JSON.stringify(metadata),
      },
      body: JSON.stringify(body),
    });

  saveDashboardMeta = (id: string, metadata: DashboardMetaData) =>
    fetch(`${this.baseUrl}/metadata/dashboard/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: this.masterKey,
        [BlobAPIHeaders.MetaData]: JSON.stringify(metadata),
      },
    });

  deleteDashboard = (dashboardId: string) =>
    fetch(`${this.baseUrl}/blobs/dashboard/${dashboardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.masterKey,
      },
    });

  saveThumbnail = (dashboardId: string, arrayBuffer: string) =>
    fetch(`${this.baseUrl}/blobs/thumbnail/${dashboardId}`, {
      method: 'PUT',
      headers: {
        Authorization: this.masterKey,
      },
      body: `data:image/png;base64,${arrayBuffer}`,
    });

  getThumbnailByDashboardId = (dashboardId: string): Promise<any> =>
    fetch(`${this.baseUrl}/blobs/thumbnail/${dashboardId}`, {
      headers: {
        Authorization: this.readKey,
      },
    });
}

export default BlobAPI;
