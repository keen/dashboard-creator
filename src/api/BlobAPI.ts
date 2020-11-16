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
    }).then((res) => res.json());

  getDashboards = (): Promise<DashboardMetaData[]> =>
    fetch(`${this.baseUrl}/metadata/dashboard`, {
      headers: this.setAuthorizationHeader(),
    }).then((res) => res.json());

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
}

export default BlobAPI;
