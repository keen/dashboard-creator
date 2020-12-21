import calculateGhostSize from './calculateGhostSize';

import { GridSize } from '../../../types';

jest.mock('../../../utils', () => {
  return {
    getDroppingItemSize: () => ({ w: 2, h: 2 }),
  };
});

const gridSize: GridSize = {
  cols: 10,
  containerWidth: 1200,
  margin: [15, 15],
};

test('get ghost size for chart widget', () => {
  const ghost = calculateGhostSize(gridSize, 'visualization');
  expect(ghost).toMatchInlineSnapshot(`
    Object {
      "height": 45,
      "width": 222,
    }
  `);
});

test('get ghost size for text widget', () => {
  const ghost = calculateGhostSize(gridSize, 'text');
  expect(ghost).toMatchInlineSnapshot(`
    Object {
      "height": 45,
      "width": 222,
    }
  `);
});
