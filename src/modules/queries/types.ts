import { Query } from '@keen.io/parser';

export type SavedQueryAPIResponse = {
  query: Query;
  query_name: string;
};

export type SavedQuery = {
  id: string;
  settings: Query;
};
