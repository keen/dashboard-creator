import { applySettings, setupDashboardEventStreams } from './actions';
import { ReducerState, SchemaPropertiesList } from './types';

import { getFilterSettings } from './selectors';

import filterSlice, { initialState } from './reducer';
import { filterSaga } from './filterSaga';
const filterReducer = filterSlice.reducer;
const filterActions = {
  ...filterSlice.actions,
  applySettings,
  setupDashboardEventStreams,
};

const filterSelectors = {
  getFilterSettings,
};

export {
  filterReducer,
  initialState,
  filterActions,
  filterSelectors,
  filterSaga,
};

export type { ReducerState, SchemaPropertiesList };
