import { generateRulerSettings } from './generateRulerSettings';

test('generates ruler settings', () => {
  const interval = { minimum: 0, maximum: 20, step: 5 };
  expect(generateRulerSettings(interval)).toMatchInlineSnapshot(`
    Array [
      Object {
        "label": 0,
        "position": "0%",
      },
      Object {
        "label": "5",
        "position": "25%",
      },
      Object {
        "label": "10",
        "position": "50%",
      },
      Object {
        "label": "15",
        "position": "75%",
      },
      Object {
        "label": 20,
        "position": "100%",
      },
    ]
  `);
});
