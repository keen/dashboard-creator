import { mergeSettingsWithFontFallback } from './mergeSettingsWithFontFallback';

test('merge provided settings with fallback fonts', () => {
  const settings = {
    settings: {
      widgetSettings: {
        title: {
          fontFamily: 'Arial',
          fontWeight: 'normal',
        },
        legend: {
          fontFamily: 'Helvetica',
          fontSize: 20,
        },
      },
    },
  };

  const font = 'Inter';
  expect(mergeSettingsWithFontFallback(font, settings)).toMatchInlineSnapshot(`
    Object {
      "settings": Object {
        "widgetSettings": Object {
          "legend": Object {
            "fontFamily": "Inter, Arial, Helvetica, sans-serif",
            "fontSize": 20,
          },
          "title": Object {
            "fontFamily": "Inter, Arial, Helvetica, sans-serif",
            "fontWeight": "normal",
          },
        },
      },
    }
  `);
});
