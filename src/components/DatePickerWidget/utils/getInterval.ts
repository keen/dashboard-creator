import { TIME_UNITS } from '@keen.io/ui-core';

type Keys = keyof typeof TIME_UNITS;
type Units = typeof TIME_UNITS[Keys];

export const getInterval = (units: Units) =>
  Object.keys(TIME_UNITS).find((key: Keys) => TIME_UNITS[key] === units);
