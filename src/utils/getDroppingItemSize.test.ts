import getDroppingItemSize from './getDroppingItemSize';

test('get dropping item size for "visualization" item', () => {
  const itemSize = getDroppingItemSize('visualization');
  expect(itemSize).toMatchInlineSnapshot(`
    Object {
      "h": 9,
      "i": "dropping-item",
      "minH": 6,
      "minW": 2,
      "w": 4,
    }
  `);
});

test('get dropping item size for "text" item', () => {
  const itemSize = getDroppingItemSize('text');
  expect(itemSize).toMatchInlineSnapshot(`
    Object {
      "h": 2,
      "i": "dropping-item",
      "minH": 1,
      "minW": 2,
      "w": 2,
    }
  `);
});
