import getDroppingItemSize from './getDroppingItemSize';

test('get dropping item size for "visualization" item', () => {
  const itemSize = getDroppingItemSize('visualization');
  expect(itemSize).toMatchInlineSnapshot(`
    Object {
      "h": 7,
      "i": "dropping-item",
      "w": 3,
    }
  `);
});

test('get dropping item size for "text" item', () => {
  const itemSize = getDroppingItemSize('text');
  expect(itemSize).toMatchInlineSnapshot(`
    Object {
      "h": 3,
      "i": "dropping-item",
      "w": 3,
    }
  `);
});
