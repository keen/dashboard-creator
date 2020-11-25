import { createContext } from 'react';

import { BlobAPI } from '../api';

export const APIContext = createContext<{
  blobApi: BlobAPI;
}>({
  blobApi: null,
});
