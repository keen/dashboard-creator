import { serializeSavedQuery } from './serializers';
import queriesSlice from './reducer';
import { selectSavedQuery, createQuery } from './actions';

import { getInterimQuery, getInterimQueriesLength } from './selectors';
import { updateSaveQuery } from './saga';
import { SavedQuery, QueryVisualization, SavedQueryAPIResponse } from './types';

const queriesReducer = queriesSlice.reducer;
const queriesActions = {
  ...queriesSlice.actions,
  selectSavedQuery,
  createQuery,
};

const queriesSelectors = {
  serializeSavedQuery,
  getInterimQueriesLength,
  getInterimQuery,
};

const queriesSagas = {
  updateSaveQuery,
};

export { queriesSelectors, queriesActions, queriesSagas, queriesReducer };

export type { SavedQuery, SavedQueryAPIResponse, QueryVisualization };
