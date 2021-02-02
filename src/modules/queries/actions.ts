import { createAction } from '@reduxjs/toolkit';

import { SavedQuery } from './types';

import {
  SELECT_SAVED_QUERY,
  CREATE_QUERY,
  ADD_INTERIM_QUERY,
  REMOVE_INTERIM_QUERIES,
} from './constants';

export const selectSavedQuery = createAction(
  SELECT_SAVED_QUERY,
  (query: SavedQuery) => ({
    payload: {
      query,
    },
  })
);

export const createQuery = createAction(CREATE_QUERY);

export const addInterimQuery = createAction(
  ADD_INTERIM_QUERY,
  (widgetId: string, data: Record<string, any>) => ({
    payload: {
      widgetId,
      data,
    },
  })
);

export const removeInterimQueries = createAction(REMOVE_INTERIM_QUERIES);

export type QueriesActions =
  | ReturnType<typeof selectSavedQuery>
  | ReturnType<typeof addInterimQuery>
  | ReturnType<typeof removeInterimQueries>
  | ReturnType<typeof createQuery>;
