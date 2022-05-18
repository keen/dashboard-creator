import { createAction } from '@reduxjs/toolkit';
import { SavedQuery } from './types';

export const selectSavedQuery = createAction(
  '@queries/SELECT_SAVED_QUERY',
  (query: SavedQuery) => ({
    payload: {
      query,
    },
  })
);

export const createQuery = createAction('@queries/CREATE_QUERY');
