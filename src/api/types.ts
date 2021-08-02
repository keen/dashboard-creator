export type DashboardAPIOptions = {
  url: string;
  accessKey: string;
  masterKey?: string;
  projectId: string;
};

export enum DashboardAPIHeaders {
  MetaData = 'X-Keen-Blob-Metadata',
}
