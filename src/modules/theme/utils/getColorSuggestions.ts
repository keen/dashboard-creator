import { ThemeSettings } from '../types';
import { getNestedObjectKeysAndValues } from '../../../utils';
import { DEFAULT_BACKGROUND_COLOR } from '../../../constants';
import { THEME_COLOR_PATHS } from '../constants';

export const getColorSuggestions = (
  currentColors: string[],
  theme: Partial<ThemeSettings>
): string[] => {
  return [
    ...new Set([
      ...currentColors,
      ...getNestedObjectKeysAndValues(
        theme,
        (keychain) =>
          keychain.endsWith('fontColor') || THEME_COLOR_PATHS.includes(keychain)
      ).values,
      DEFAULT_BACKGROUND_COLOR,
    ]),
  ].filter((color) => !['initial', 'inherit'].includes(color));
};
