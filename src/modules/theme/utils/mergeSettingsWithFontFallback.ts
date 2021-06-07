import deepMerge from 'deepmerge';
import {
  getNestedObjectKeysAndValues,
  transformDotNotationToNested,
} from '../../../utils';
import { getFontFallback } from './getFontFallback';

/**
 * Merges widget settings with font
 *
 * @param font - font name as string
 * @param settings - widget settings
 * @return widget settings with font fallback added
 *
 */

export const mergeSettingsWithFontFallback = <T>(font: string, settings: T) => {
  const { keys } = getNestedObjectKeysAndValues(settings, (keychain) =>
    keychain.endsWith('fontFamily')
  );

  const fallbackFontsSettings = keys.reduce((acc, key) => {
    acc[key] = getFontFallback(font);
    return acc;
  }, {});

  const nestedFallbackFontsSettings = transformDotNotationToNested(
    fallbackFontsSettings
  );

  return (deepMerge(settings, nestedFallbackFontsSettings) as unknown) as T;
};
