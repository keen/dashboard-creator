import { getDroppingItemSize } from '../../../utils';

import { Breakpoint, Breakpoints } from '../types';
import { WidgetType } from '../../../types';

import {
  ROW_HEIGHT,
  GRID_MARGIN,
  GRID_CONTAINER_PADDING,
  GRID_BREAKPOINTS,
  GRID_COLS,
} from '../../Grid/constants';

const sortBreakpoints = (breakpoints: Breakpoints): Breakpoint[] => {
  const keys = Object.keys(breakpoints) as Breakpoint[];
  return keys.sort((a, b) => breakpoints[a] - breakpoints[b]);
};

const getBreakpointFromWidth = (
  breakpoints: Breakpoints,
  width: number
): Breakpoint => {
  const sortedBreakpoints = sortBreakpoints(breakpoints);
  let matching = sortedBreakpoints[0];
  for (let i = 1, len = sortedBreakpoints.length; i < len; i++) {
    const breakpointName = sortedBreakpoints[i];
    if (width > breakpoints[breakpointName]) matching = breakpointName;
  }
  return matching;
};

const getColsFromBreakpoint = (
  breakpoint: Breakpoint,
  breakpoints: Breakpoints
): number => {
  if (!breakpoints[breakpoint]) {
    throw new Error(`"cols" entry for breakpoint ${breakpoint} is missing`);
  }
  return breakpoints[breakpoint];
};

const calculateGhostSize = (containerWidth: number, widgetType: WidgetType) => {
  const { w: columns, h: rows } = getDroppingItemSize(widgetType);
  const [horizontalGap, verticalGap] = GRID_MARGIN;
  const horizontalPadding = GRID_CONTAINER_PADDING[0];
  const breakpoint = getBreakpointFromWidth(GRID_BREAKPOINTS, containerWidth);
  const cols = getColsFromBreakpoint(breakpoint, GRID_COLS);

  const columnWidth =
    (containerWidth - 2 * horizontalPadding - horizontalGap * (cols + 1)) /
    cols;
  return {
    height: rows * ROW_HEIGHT + (rows - 1) * verticalGap,
    width: columns * columnWidth + (columns - 1) * horizontalGap,
  };
};

export default calculateGhostSize;
