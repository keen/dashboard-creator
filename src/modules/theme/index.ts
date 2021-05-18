import themeSlice from './reducer';

import { getBaseTheme, getActiveDashboardTheme } from './selectors';

const themeReducer = themeSlice.reducer;
const themeActions = themeSlice.actions;

const themeSelectors = {
  getBaseTheme,
  getActiveDashboardTheme,
};

export { themeReducer, themeActions, themeSelectors };
