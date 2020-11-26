export type BlobAPIOptions = {
  url: string;
  accessKey: string;
  projectId: string;
};

export enum BlobAPIHeaders {
  MetaData = 'X-Keen-Blob-Metadata',
}
