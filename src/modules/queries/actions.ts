import { createAction } from '@reduxjs/toolkit';

import { SavedQuery } from './types';

import { SELECT_SAVED_QUERY } from './constants';

export const selectSavedQuery = createAction(
  SELECT_SAVED_QUERY,
  (query: SavedQuery) => ({
    payload: {
      query,
    },
  })
);

export type QueriesActions = ReturnType<typeof selectSavedQuery>;
