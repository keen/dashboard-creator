import themeSlice from './reducer';

import { themeSagaActions } from './actions';
import { themeSaga } from './themeSaga';

import { themeSelectors } from './selectors';
import { extendTheme } from './utils';

const themeReducer = themeSlice.reducer;
const themeActions = themeSlice.actions;

export {
  themeSaga,
  themeReducer,
  themeActions,
  themeSagaActions,
  themeSelectors,
  extendTheme,
};
