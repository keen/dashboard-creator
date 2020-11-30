import { createAction } from '@reduxjs/toolkit';
import { Query } from '@keen.io/parser';

import { SELECT_SAVED_QUERY } from './constants';

export const selectSavedQuery = createAction(
  SELECT_SAVED_QUERY,
  (queryName: string, query: Query) => ({
    payload: {
      queryName,
      query,
    },
  })
);

export type QueriesActions = ReturnType<typeof selectSavedQuery>;
