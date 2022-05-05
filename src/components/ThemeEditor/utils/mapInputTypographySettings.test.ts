import { mapInputTypographySettings } from './mapInputTypographySettings';

test('maps input typography settings', () => {
  expect(
    mapInputTypographySettings({
      fontColor: 'green',
      fontSize: '10px',
      fontWeight: 'bold',
      fontStyle: 'italic',
    })
  ).toMatchInlineSnapshot(`
    Object {
      "alignment": "left",
      "bold": true,
      "color": "green",
      "italic": true,
      "size": "10px",
      "underline": false,
    }
  `);
});
