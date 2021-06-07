import { Font } from './types';

export const CUSTOM_COLOR_PALETTE = 'custom';
export const DEFAULT_COLOR_PALETTE = 'default';

export const COLOR_PALETTES = [
  {
    name: 'fresh',
    colors: [
      '#FDBF6F',
      '#FF7F00',
      '#B2DF8A',
      '#33A02C',
      '#FB9A99',
      '#E31A1C',
      '#A6CEE3',
      '#1F78B4',
      '#CAB2D6',
      '#6A3D9A',
      '#FFFF99',
      '#B15928',
      '#FFA0F4',
      '#C946A6',
    ],
  },
  {
    name: 'playful',
    colors: [
      '#5825FE',
      '#FF6364',
      '#02CD9A',
      '#F3CA4D',
      '#0098CD',
      '#7C1473',
      '#F7967B',
      '#EFAEF5',
      '#61D5FA',
      '#F28088',
      '#8E65A6',
      '#B9A42B',
      '#95C69E',
      '#BE5122',
    ],
  },
  {
    name: 'watercolor',
    colors: [
      '#8DD3C7',
      '#FFFFB3',
      '#BEBADA',
      '#FB8072',
      '#80B1D3',
      '#FDB462',
      '#B3DE69',
      '#FCCDE5',
      '#8592AD',
      '#D2B2B2',
      '#CCEBC5',
      '#BC80BD',
      '#FFED6F',
      '#867C7B',
    ],
  },
  {
    name: 'solid',
    colors: [
      '#217378',
      '#65348F',
      '#4670B4',
      '#D21E75',
      '#3B378B',
      '#44B44F',
      '#E67436',
      '#569DD2',
      '#579F7B',
      '#595A5C',
      '#E5B032',
      '#83D2F4',
      '#CADA3D',
      '#F7C9B0',
    ],
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
