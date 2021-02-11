import { convertRelativeTime } from '@keen.io/ui-core';

const getCustomTimeframe = (timeframe: string, label: string) => {
  const { value, units } = convertRelativeTime(timeframe);

  return `${label} ${value} ${units}`;
};

export default getCustomTimeframe;
