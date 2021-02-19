import getPropertyName from './getPropertyName';

test('returns the same string if there is no divider', () => {
  const str = 'name';
  const result = getPropertyName(str);

  expect(result).toEqual(str);
});

test('returns property name for default divider', () => {
  const str = 'user.geo_info.country';
  const result = getPropertyName(str);

  expect(result).toEqual('country');
});

test('returns property name for custom divider', () => {
  const divider = ':';
  const str = 'user:geo_info:country';
  const result = getPropertyName(str, divider);

  expect(result).toEqual('country');
});
