const concatKeychain = (previousKeys, key) => {
  return previousKeys !== '' ? previousKeys + '.' + key : key;
};
/**
 * Gets all keys and values from nested object
 * Allows to narrow the results by filtering keychains
 *
 * @param obj - Object with keys and values to extract
 * @param filter - Function used to filter keys base on keychain
 * @return Object which contains keys and corresponding values
 */
export const getNestedObjectKeysAndValues = (
  obj: Record<string, any>,
  filter: (keychain) => {}
) => {
  const nestedObjectKeys = [];
  const nestedObjectValues = [];
  const getKeys = (obj, previousKey) => {
    return Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        return getKeys(obj[key], concatKeychain(previousKey, key));
      }
      const keychain = concatKeychain(previousKey, key);
      if (!filter || filter(keychain)) {
        nestedObjectKeys.push(keychain);
        nestedObjectValues.push(obj[key]);
      }
    });
  };
  getKeys(obj, '');
  return {
    keys: nestedObjectKeys,
    values: nestedObjectValues,
  };
};
