import { Font } from './types';

export const CUSTOM_COLOR_PALETTE = 'custom';
export const DEFAULT_COLOR_PALETTE = 'default';

export const COLOR_PALETTES = [
  {
    name: 'rainbow',
    colors: ['#A800FF', '#0079FF', '#00F11D', '#FFEF00', '#FF7F00', '#FF0900'],
  },
  {
    name: 'watercolor',
    colors: ['#91D0D7', '#EE82B3', '#EC5F82', '#F6E361', '#80C49D', '#D6EBDC'],
  },
  {
    name: 'dracula',
    colors: ['#50fa7b', '#ffb86c', '#6272a4', '#bd93f9', '#ff5555', '#f1fa8c'],
  },
  {
    name: CUSTOM_COLOR_PALETTE,
    colors: [],
  },
];

export const FONTS: Font[] = [
  {
    name: 'Lato',
    variant: 'sans-serif',
  },
  {
    name: 'Gangster Grotesk',
    variant: 'sans-serif',
  },
  {
    name: 'Inter',
    variant: 'sans-serif',
  },
  {
    name: 'Lora',
    variant: 'serif',
  },
  {
    name: 'Merriweather',
    variant: 'serif',
  },
  {
    name: 'Montserrat',
    variant: 'sans-serif',
  },
  {
    name: 'Noto Sans',
    variant: 'sans-serif',
  },
  {
    name: 'Noto Serif',
    variant: 'serif',
  },
  {
    name: 'Open Sans',
    variant: 'sans-serif',
  },
  {
    name: 'Oswald',
    variant: 'sans-serif',
  },
  {
    name: 'Poppins',
    variant: 'sans-serif',
  },
  {
    name: 'Playfair Display',
    variant: 'serif',
  },
  {
    name: 'PT Serif',
    variant: 'serif',
  },
  {
    name: 'Roboto',
    variant: 'sans-serif',
  },
  {
    name: 'Roboto Condensed',
    variant: 'sans-serif',
  },
  {
    name: 'Roboto Mono',
    variant: 'sans-serif',
  },
  {
    name: 'Roboto Slab',
    variant: 'serif',
  },
  {
    name: 'Rubik',
    variant: 'sans-serif',
  },
  {
    name: 'Quicksand',
    variant: 'sans-serif',
  },
];
