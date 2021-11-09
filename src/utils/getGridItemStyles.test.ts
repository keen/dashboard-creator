import getGridItemStyles from './getGridItemStyles';
import { GridPosition } from '../modules/widgets';

const gridPosition: GridPosition = {
  w: 4,
  h: 2,
  x: 4,
  y: 4,
};

const zIndexDraggedWidget = 2;

test('calculates styles for inactive grid item', () => {
  const style = getGridItemStyles(gridPosition, false, zIndexDraggedWidget);

  expect(style).toMatchInlineSnapshot(`
    Object {
      "zIndex": 4,
    }
  `);
});

test('calculates styles for active grid item', () => {
  const style = getGridItemStyles(gridPosition, true, zIndexDraggedWidget);

  expect(style).toMatchInlineSnapshot(`
    Object {
      "zIndex": 2,
    }
  `);
});
