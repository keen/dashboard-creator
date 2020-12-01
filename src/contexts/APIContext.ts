import { createContext } from 'react';

import { BlobAPI } from '../api';

export const APIContext = createContext<{
  blobApi: BlobAPI;
  keenAnalysis: any;
}>({
  blobApi: null,
  keenAnalysis: null,
});
