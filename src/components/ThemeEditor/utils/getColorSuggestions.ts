import { getNestedObjectKeysAndValues } from '../../../utils';

export const getColorSuggestions = (currentColors, theme) => {
  return [
    ...new Set([
      ...currentColors,
      ...getNestedObjectKeysAndValues(theme, (keychain) =>
        keychain.endsWith('fontColor')
      ).values,
    ]),
  ].filter((color) => !['initial', 'inherit'].includes(color));
};
