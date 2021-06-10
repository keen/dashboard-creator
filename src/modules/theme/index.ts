import themeSlice from './reducer';

import { themeSagaActions } from './actions';
import { themeSaga } from './themeSaga';

import {
  CUSTOM_COLOR_PALETTE,
  DEFAULT_COLOR_PALETTE,
  COLOR_PALETTES,
  FONTS,
} from './constants';
import { themeSelectors } from './selectors';
import {
  extendTheme,
  getColorSuggestions,
  mergeSettingsWithFontFallback,
  getFontFallback,
} from './utils';

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
  getColorSuggestions,
  mergeSettingsWithFontFallback,
  getFontFallback,
  DEFAULT_COLOR_PALETTE,
  CUSTOM_COLOR_PALETTE,
  COLOR_PALETTES,
  FONTS,
  ThemeEditorSection,
  ThemeSettings,
};
