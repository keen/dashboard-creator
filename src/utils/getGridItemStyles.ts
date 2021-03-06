import { GridPosition } from '../modules/widgets';

/**
 * Creates styles for grid item based on position.
 * Used to correctly display widget overlays.
 *
 * @param position - Grid item position
 * @return void
 *
 */
const getGridItemStyles = ({ y }: GridPosition) => ({
  zIndex: y,
});

export default getGridItemStyles;
