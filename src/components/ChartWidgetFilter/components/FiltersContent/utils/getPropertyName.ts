const getPropertyName = (name: string, divider = '.') => {
  const arr = name.split(divider);
  return arr[arr.length - 1];
};

export default getPropertyName;
