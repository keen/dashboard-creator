import { BlobAPI } from './api';

import { BLOB_API } from './constants';

type Options = {
  blobApiUrl: string;
  accessKey: string;
  projectId: string;
};

export const createSagaContext = ({
  projectId,
  accessKey,
  blobApiUrl,
}: Options) => ({
  [BLOB_API]: new BlobAPI({
    projectId,
    accessKey,
    url: blobApiUrl,
  }),
});
