import { TooltipMode } from '@keen.io/ui-core';

export const COLOR_MODES_ITEMS = [
  { id: 'light', label: 'Light', value: 'light' },
  { id: 'dark', label: 'Dark', value: 'dark' },
];

export const AVAILABLE_SETTINGS = {
  color: false,
  fontSize: true,
  fontStyle: false,
  alignment: false,
};

export const FONT_SIZE_SETTINGS = [16, 15, 14, 13, 12, 11, 10, 9];

export const COLOR_MODE: {
  [key: string]: TooltipMode;
} = {
  light: 'light',
  dark: 'dark',
};
