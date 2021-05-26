import {
  COLOR_PALETTES,
  DEFAULT_COLOR_PALETTE,
} from '../../../../../modules/theme';

export const createColorPalettes = (defaultColors: string[]) => [
  { name: DEFAULT_COLOR_PALETTE, colors: defaultColors },
  ...COLOR_PALETTES,
];
