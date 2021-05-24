import themeSlice from './reducer';

import { themeSagaActions } from './actions';
import { themeSaga } from './themeSaga';

import { CUSTOM_COLOR_THEME } from './constants';
import { themeSelectors } from './selectors';
import { extendTheme } from './utils';

import { ThemeEditorSection, ThemeSettings } from './types';

const themeReducer = themeSlice.reducer;
const themeActions = themeSlice.actions;

export {
  themeSaga,
  themeReducer,
  themeActions,
  themeSagaActions,
  themeSelectors,
  extendTheme,
  CUSTOM_COLOR_THEME,
  ThemeEditorSection,
  ThemeSettings,
};
