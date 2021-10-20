import { GridPosition } from '../modules/widgets';

/**
 * Creates styles for grid item based on position.
 * Used to correctly display widget overlays.
 *
 * @param position - Grid item position
 * @param isActiveWidget - active widget indicator
 * @param zIndexDraggedWidget - z index applied for dragged widget
 * @return void
 *
 */
const getGridItemStyles = (
  { y }: GridPosition,
  isActiveWidget: boolean,
  zIndexDraggedWidget: number
): Record<string, any> => ({
  zIndex: isActiveWidget ? zIndexDraggedWidget : y,
});

export default getGridItemStyles;
