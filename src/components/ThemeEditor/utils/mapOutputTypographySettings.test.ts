import { mapOutputTypographySettings } from './mapOutputTypographySettings';

test('maps output typography settings', () => {
  expect(
    mapOutputTypographySettings({
      color: 'green',
      size: 12,
      bold: true,
      italic: true,
    })
  ).toMatchInlineSnapshot(`
    Object {
      "fontColor": "green",
      "fontSize": 12,
      "fontStyle": "italic",
      "fontWeight": "bold",
    }
  `);
});
