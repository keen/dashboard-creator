import calculateGhostSize from './calculateGhostSize';

jest.mock('../../../utils', () => {
  return {
    getDroppingItemSize: () => ({ w: 2, h: 2 }),
  };
});

const containerWidth = 1200;

test('get ghost size for chart widget', () => {
  const ghost = calculateGhostSize(containerWidth, 'visualization');
  expect(ghost).toMatchInlineSnapshot(`
    Object {
      "height": 50,
      "width": 176.66666666666666,
    }
  `);
});

test('get ghost size for text widget', () => {
  const ghost = calculateGhostSize(containerWidth, 'text');
  expect(ghost).toMatchInlineSnapshot(`
    Object {
      "height": 50,
      "width": 176.66666666666666,
    }
  `);
});
