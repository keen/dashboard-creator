import { ThemeSettings } from '../../../modules/theme';
import { getNestedObjectKeysAndValues } from '../../../utils';
import { DEFAULT_BACKGROUND_COLOR } from '../../../constants';

export const getColorSuggestions = (
  currentColors: string[],
  theme: Partial<ThemeSettings>
): string[] => {
  return [
    ...new Set([
      ...currentColors,
      ...getNestedObjectKeysAndValues(theme, (keychain) =>
        keychain.endsWith('fontColor')
      ).values,
      DEFAULT_BACKGROUND_COLOR,
    ]),
  ].filter((color) => !['initial', 'inherit'].includes(color));
};
