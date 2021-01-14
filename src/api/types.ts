export type BlobAPIOptions = {
  url: string;
  accessKey: string;
  masterKey?: string;
  projectId: string;
};

export enum BlobAPIHeaders {
  MetaData = 'X-Keen-Blob-Metadata',
}
