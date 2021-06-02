import { ThemeSettings } from '../../../modules/theme';
import { getNestedObjectKeysAndValues } from '../../../utils';

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
    ]),
  ].filter((color) => !['initial', 'inherit'].includes(color));
};
