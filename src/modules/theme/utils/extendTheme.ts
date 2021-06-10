import deepMerge from 'deepmerge';
import { Theme, theme as defaultChartTheme } from '@keen.io/charts';

/**
 * Extends visualization theme with custom settings
 *
 * @param customTheme - partial theme object
 * @return theme settings
 *
 */
export const extendTheme = (
  customTheme: Partial<Theme> = {},
  baseTheme: Partial<Theme> = defaultChartTheme
) =>
  deepMerge(baseTheme, customTheme as Partial<Theme>, {
    arrayMerge: (_target, source) => source,
  });
