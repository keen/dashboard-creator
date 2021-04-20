import { getDroppingItemSize } from '../../../utils';
import { WidgetType } from '../../../types';

import {
  ROW_HEIGHT,
  GRID_MARGIN,
  GRID_CONTAINER_PADDING,
  COLUMNS_NUMBER_IN_EDIT_MODE,
} from '../../Grid/constants';

const calculateGhostSize = (containerWidth: number, widgetType: WidgetType) => {
  const { w: columns, h: rows } = getDroppingItemSize(widgetType);
  const [horizontalGap, verticalGap] = GRID_MARGIN;
  const horizontalPadding = GRID_CONTAINER_PADDING[0];

  const columnWidth =
    (containerWidth -
      2 * horizontalPadding -
      horizontalGap * (COLUMNS_NUMBER_IN_EDIT_MODE + 1)) /
    COLUMNS_NUMBER_IN_EDIT_MODE;
  return {
    height: rows * ROW_HEIGHT + (rows - 1) * verticalGap,
    width: columns * columnWidth + (columns - 1) * horizontalGap,
  };
};

export default calculateGhostSize;
