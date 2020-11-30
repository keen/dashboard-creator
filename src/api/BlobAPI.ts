import { handleResponse } from './utils';

import { BlobAPIOptions, BlobAPIHeaders } from './types';

import { DashboardModel, DashboardMetaData } from '../modules/dashboards';

class BlobAPI {
  /** Authorization access key */
  private readonly accessKey: string;

  /** API base url */
  private readonly baseUrl: string;

  private setAuthorizationHeader = () => ({
    Authorization: this.accessKey,
  });

  constructor({ url, accessKey, projectId }: BlobAPIOptions) {
    this.accessKey = accessKey;
    this.baseUrl = `${url}/projects/${projectId}`;
  }

  getDashboardById = (id: string): Promise<DashboardModel> =>
    fetch(`${this.baseUrl}/blobs/dashboard/${id}`, {
      headers: this.setAuthorizationHeader(),
    }).then(handleResponse);

  getDashboards = (): Promise<DashboardMetaData[]> =>
    fetch(`${this.baseUrl}/metadata/dashboard`, {
      headers: this.setAuthorizationHeader(),
    }).then(handleResponse);

  saveDashboard = (
    id: string,
    body: DashboardModel,
    metadata: DashboardMetaData
  ) =>
    fetch(`${this.baseUrl}/blobs/dashboard/${id}`, {
      method: 'PUT',
      headers: {
        ...this.setAuthorizationHeader(),
        [BlobAPIHeaders.MetaData]: JSON.stringify(metadata),
      },
      body: JSON.stringify(body),
    });

  deleteDashboard = (dashboardId: string) =>
    fetch(`${this.baseUrl}/blobs/dashboard/${dashboardId}`, {
      method: 'DELETE',
      headers: {
        ...this.setAuthorizationHeader(),
      },
    });

  saveThumbnail = (dashboardId: string, arrayBuffer: string) =>
    fetch(`${this.baseUrl}/blobs/thumbnail/${dashboardId}`, {
      method: 'PUT',
      headers: {
        ...this.setAuthorizationHeader(),
      },
      body: `data:image/png;base64,${arrayBuffer}`,
    });

  getThumbnailByDashboardId = (dashboardId: string): Promise<any> =>
    fetch(`${this.baseUrl}/blobs/thumbnail/${dashboardId}`, {
      headers: this.setAuthorizationHeader(),
    });
}

export default BlobAPI;
