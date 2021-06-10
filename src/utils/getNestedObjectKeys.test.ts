import { getNestedObjectKeysAndValues } from './getNestedObjectKeys';

const nestedObject = {
  a: {
    e: 'Test1',
  },
  b: {
    c: {
      d: {
        g: 'Test3',
      },
      f: 'Test2',
    },
  },
};

test('flatten object keys and return all of the keychains and corresponding values', () => {
  const { keys, values } = getNestedObjectKeysAndValues(nestedObject);
  expect(keys).toStrictEqual(['a.e', 'b.c.d.g', 'b.c.f']);
  expect(values).toStrictEqual(['Test1', 'Test3', 'Test2']);
});

test('filter keychains when filter function is provided', () => {
  const { keys, values } = getNestedObjectKeysAndValues(
    nestedObject,
    (keychain) => keychain.endsWith('.c.f')
  );
  expect(keys).toStrictEqual(['b.c.f']);
  expect(values).toStrictEqual(['Test2']);
});
