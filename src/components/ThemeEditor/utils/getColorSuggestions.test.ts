import { getColorSuggestions } from './getColorSuggestions';

test('generate color suggestions from theme', () => {
  const currentColors = ['red', 'white', 'blue'];
  const theme = {
    theme: {
      pie: {
        labels: {
          enabled: true,
          typography: {
            fontStyle: 'normal' as 'normal',
            fontWeight: 'normal' as 'normal',
            fontSize: 12,
            fontFamily: 'Roboto Mono, Arial, Helvetica, sans-serif',
            fontColor: 'green',
          },
        },
      },
      donut: {
        labels: {
          enabled: true,
          typography: {
            fontStyle: 'normal' as 'normal',
            fontWeight: 'normal' as 'normal',
            fontSize: 12,
            fontFamily: 'Roboto Mono, Arial, Helvetica, sans-serif',
            fontColor: 'yellow',
          },
        },
        total: {
          enabled: true,
          label: {
            typography: {
              fontStyle: 'normal' as 'normal',
              fontWeight: 'normal' as 'normal',
              fontSize: 12,
              fontFamily: 'Roboto Mono, Arial, Helvetica, sans-serif',
              fontColor: 'inherit',
            },
          },
          value: {
            typography: {
              fontStyle: 'normal' as 'normal',
              fontWeight: 'normal' as 'normal',
              fontSize: 12,
              fontFamily: 'Roboto Mono, Arial, Helvetica, sans-serif',
              fontColor: 'green',
            },
          },
        },
      },
      bar: {
        values: {
          typography: {
            fontStyle: 'normal' as 'normal',
            fontWeight: 'normal' as 'normal',
            fontSize: 12,
            fontFamily: 'Roboto Mono, Arial, Helvetica, sans-serif',
            fontColor: 'initial',
          },
        },
      },
    },
  };

  expect(getColorSuggestions(currentColors, theme)).toMatchInlineSnapshot(`
    Array [
      "red",
      "white",
      "blue",
      "green",
      "yellow",
    ]
  `);
});
