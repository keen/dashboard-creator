import { SavedQueryAPIResponse } from '../types';

export const serializeSavedQuery = ({
  query_name: queryName,
  query,
}: SavedQueryAPIResponse) => ({
  id: queryName,
  settings: query,
});
