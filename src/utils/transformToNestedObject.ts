/**
 * Transforms dot notation key and value to nested object
 *
 * @param key - Object key
 * @param value - Object value
 * @return Object structure
 */

export const transformToNestedObject = (key: string, value: any) => {
  const entries = key.split('.');
  const obj = entries.reverse().reduce((acc, entry, idx) => {
    if (idx === 0) {
      acc[entry] = value;
      return acc;
    } else {
      acc = { [entry]: { ...acc } };
      return acc;
    }
  }, {});

  return obj;
};
