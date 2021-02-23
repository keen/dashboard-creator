import capitalize from './capitalize';

test('capitalize provided string', () => {
  const str = 'name';
  const result = capitalize(str);

  expect(result).toEqual('Name');
});
