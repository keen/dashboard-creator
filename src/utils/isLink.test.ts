import isLink from './isLink';

test('url is link to jpg file', () => {
  expect(isLink('http://www.example.com/file.jpg')).toBe(true);
});

test('url is link to jpeg file', () => {
  expect(isLink('http://www.example.com/file.jpeg')).toBe(true);
});

test('url is link to gif file', () => {
  expect(isLink('http://www.example.com/file.gif')).toBe(true);
});

test('url is link to png file', () => {
  expect(isLink('http://www.example.com/file.png')).toBe(true);
});

test('url is link to svg file', () => {
  expect(isLink('http://www.example.com/file.svg')).toBe(true);
});

test('url is link to webp file', () => {
  expect(isLink('http://www.example.com/file.webp')).toBe(true);
});

test('url is an empty string', () => {
  expect(isLink('')).toBe(false);
});

test('url is a random string', () => {
  expect(isLink('just text')).toBe(false);
});

test('url does not start with http or https', () => {
  expect(isLink('ahttp://www.example.com/file.png')).toBe(false);
});

test('url ends with not supported format', () => {
  expect(isLink('http://www.example.com/file.mp3')).toBe(false);
});
