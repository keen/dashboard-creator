import { createAction } from '@reduxjs/toolkit';

import { SavedQuery } from './types';

import { SELECT_SAVED_QUERY, CREATE_QUERY } from './constants';

export const selectSavedQuery = createAction(
  SELECT_SAVED_QUERY,
  (query: SavedQuery) => ({
    payload: {
      query,
    },
  })
);

export const createQuery = createAction(CREATE_QUERY);

export type QueriesActions =
  | ReturnType<typeof selectSavedQuery>
  | ReturnType<typeof createQuery>;
