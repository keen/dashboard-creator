import { handleResponse } from './utils';

import { DashboardAPIOptions, DashboardAPIHeaders } from './types';

import { DashboardModel, DashboardMetaData } from '../modules/dashboards';

class DashboardAPI {
  /** Authorization read access key */
  private readonly readKey: string;

  /** Authorization master key */
  private readonly masterKey: string;

  /** API base url */
  private readonly baseUrl: string;

  constructor({ url, accessKey, masterKey, projectId }: DashboardAPIOptions) {
    this.masterKey = masterKey;
    this.readKey = accessKey;
    this.baseUrl = `${url}/projects/${projectId}`;
  }

  getDashboardById = (id: string): Promise<DashboardModel> =>
    fetch(`${this.baseUrl}/dashboards/${id}`, {
      headers: {
        Authorization: this.readKey,
      },
    }).then(handleResponse);

  getDashboardMetaDataById = (id: string): Promise<DashboardMetaData> =>
    fetch(`${this.baseUrl}/dashboards/${id}/metadata`, {
      headers: {
        Authorization: this.readKey,
      },
    }).then(handleResponse);

  getDashboards = (): Promise<DashboardMetaData[]> =>
    fetch(`${this.baseUrl}/dashboards/metadata`, {
      headers: {
        Authorization: this.readKey,
      },
    }).then(handleResponse);

  saveDashboard = (
    id: string,
    body: DashboardModel,
    metadata: DashboardMetaData
  ) =>
    fetch(`${this.baseUrl}/dashboards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.masterKey,
        [DashboardAPIHeaders.MetaData]: JSON.stringify(metadata),
      },
      body: JSON.stringify(body),
    });

  saveDashboardMeta = (id: string, metadata: DashboardMetaData) =>
    fetch(`${this.baseUrl}/dashboards/${id}/metadata`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.masterKey,
        [DashboardAPIHeaders.MetaData]: JSON.stringify(metadata),
      },
      body: JSON.stringify(metadata),
    }).then(handleResponse);

  deleteDashboard = (dashboardId: string) =>
    fetch(`${this.baseUrl}/dashboards/${dashboardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: this.masterKey,
      },
    });
}

export default DashboardAPI;
