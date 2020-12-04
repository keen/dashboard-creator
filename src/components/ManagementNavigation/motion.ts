import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const pulseMotion = {
  animate: {
    boxShadow: `0 0 2px 4px ${transparentize(0.6, colors.green[400])}`,
  },
  transition: { yoyo: Infinity, repeatDelay: 0.3, duration: 0.5 },
};
