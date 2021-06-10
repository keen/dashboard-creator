/**
 * Transforms object with dot notation keys to nested object
 *
 * @param object - Object with dot notation keys
 * @return - nested object
 */

export const transformDotNotationToNested = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((result, cur) => {
    cur
      .split('.')
      .reduce(
        (acc, key, idx, arr) =>
          (acc[key] =
            idx === arr.length - 1 ? obj[cur] : acc[key] ? acc[key] : {}),
        result
      );
    return result;
  }, {});
};
