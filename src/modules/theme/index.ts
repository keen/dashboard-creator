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
import { useApplyWidgetTheming } from './hooks';

const themeReducer = themeSlice.reducer;
const themeActions = themeSlice.actions;

const themeHooks = {
  useApplyWidgetTheming,
};

export {
  themeSaga,
  themeReducer,
  themeActions,
  themeSagaActions,
  themeSelectors,
  themeHooks,
  extendTheme,
  getColorSuggestions,
  mergeSettingsWithFontFallback,
  getFontFallback,
  DEFAULT_COLOR_PALETTE,
  CUSTOM_COLOR_PALETTE,
  COLOR_PALETTES,
  FONTS,
  ThemeEditorSection,
};

export type { ThemeSettings };
