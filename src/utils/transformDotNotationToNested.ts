import deepMerge from 'deepmerge';

/**
 * Transforms object with dot notation keys to nested object
 *
 * @param object - Object with dot notation keys
 * @return - nested object
 */

export const transformDotNotationToNested = (obj: Record<string, any>) => {
  let result = {};

  Object.keys(obj).forEach((key) => {
    const entries = key.split('.');
    const nestedObject = entries.reverse().reduce((acc, entry, idx) => {
      if (idx === 0) {
        acc[entry] = obj[key];
        return acc;
      } else {
        acc = { [entry]: { ...acc } };
        return acc;
      }
    }, {});
    result = deepMerge(result, nestedObject);
  });

  return result;
};
