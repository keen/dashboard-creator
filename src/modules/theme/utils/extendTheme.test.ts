import { extendTheme } from './extendTheme';
import { Typography } from '@keen.io/ui-core';

test('extends theme with provided values', () => {
  expect(
    extendTheme({
      colors: ['yellow', 'orange'],
      bar: {
        values: {
          typography: {
            fontColor: 'green',
            fontStyle: 'italic',
          } as Typography,
        },
      },
    })
  ).toMatchSnapshot();
});
