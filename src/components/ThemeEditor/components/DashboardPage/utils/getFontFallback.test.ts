import { getFontFallback } from './getFontFallback';

test('get font fallback for sans-serif font', () => {
  const font = 'Lato';
  expect(getFontFallback(font)).toMatchInlineSnapshot(
    `"Lato, Arial, Helvetica, sans-serif"`
  );
});

test('get font fallback for serif font', () => {
  const font = 'Lora';
  expect(getFontFallback(font)).toMatchInlineSnapshot(
    `"Lora, Times, \\"Times New Roman\\", serif"`
  );
});

test('get font fallback for not supported font', () => {
  const font = 'Not Supported Font';
  expect(getFontFallback(font)).toMatchInlineSnapshot(
    `"Not Supported Font, Arial, Helvetica, sans-serif"`
  );
});
