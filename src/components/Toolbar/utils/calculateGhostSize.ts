import { getDroppingItemSize } from '../../../utils';

import { ROW_HEIGHT } from '../../Grid/constants';
import { GridSize, WidgetType } from '../../../types';

const calculateGhostSize = (gridSize: GridSize, widgetType: WidgetType) => {
  const { w: columns, h: rows } = getDroppingItemSize(widgetType);
  const { containerWidth, margin, cols, containerPadding } = gridSize;
  const horizontalPadding = containerPadding ? containerPadding[0] : 0;
  const [horizontalGap, verticalGap] = margin;
  const columnWidth =
    (containerWidth - 2 * horizontalPadding - horizontalGap * (cols + 1)) /
    cols;
  return {
    height: rows * ROW_HEIGHT + (rows - 1) * verticalGap,
    width: columns * columnWidth + (columns - 1) * horizontalGap,
  };
};

export default calculateGhostSize;
