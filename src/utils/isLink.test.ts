import isLink from './isLink';

test('url is link to jpg file', () => {
  expect(isLink('http://www.example.com/file.jpg')).toBe(true);
});

test('url is link to gif file', () => {
  expect(isLink('http://www.example.com/file.gif')).toBe(true);
});

test('url is link to png file', () => {
  expect(isLink('http://www.example.com/file.png')).toBe(true);
});

test('url is an empty string', () => {
  expect(isLink('')).toBe(false);
});

test('url is a random string', () => {
  expect(isLink('just text')).toBe(false);
});
